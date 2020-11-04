const fs = require("fs");
const path = require("path");

const Eris = require("eris-additions")(require("eris"));
const Sequelize = require("sequelize");

const PermissionError = require("./errors/permissionError");

const Group = require("./group");
const Logger = require("./logger");

const initDB = require("./initDB");

function validatePermission(member, permissions) {
  if (permissions instanceof Array) {
    for (const permission of permissions) {
      const hasPermission = member.permission.has(permission);
      if (!hasPermission)
        throw new PermissionError("missing permission.", permission);
    }
  } else {
    const hasPermission = member.permission.has(permissions);
    if (!hasPermission)
      throw new PermissionError("missing permission.", permissions);
  }
}

class CmdClient extends Eris.Client {
  constructor(token, options = {}) {
    super(token, options);
    this.prefix = options.prefix || "!";
    this.owners = options.owners || [];

    this.commands = new Eris.Collection();
    this.groups = new Eris.Collection();

    this.debugMode = options.debugMode || false;

    this.logger = new Logger(options.debugMode ? Logger.TRACE : Logger.INFO, "main");
    this.logger.info("logger initialized.");

    this.languages = this._loadLanguages();

    this.supportChannelID = options.supportChannelID;

    this.cooldowns = new Eris.Collection()

    this.extensions = {};

    this.sequelizeLogger = new Logger(this.debugMode ? Logger.TRACE : Logger.INFO, "sequelize");
    global.sequelize = new Sequelize(options.db.database, options.db.username, options.db.password, {
      host: options.db.localhost,
      dialect: options.db.dialect,
      storage: options.db.storage,
      dialectOptions: { timezone: "Etc/GMT0" },
      logging: (...msg) => this.sequelizeLogger.debug(msg),
    });
    global.db = initDB(sequelize, Sequelize.DataTypes);

    if (options.debugMode) {
      this._erisLogger = new Logger(Logger.TRACE, "eris");
      this.on("debug", msg => this._erisLogger.debug(msg));
    }

    this.once("ready", () => {
      this.logger.info(`${this.user.username} online!`);
      this.editStatus("online", { name: `${this.prefix}help`, type: 3 });

      sequelize.sync()
        .then(() => this.logger.info("successfully connected to the database."));

      for (const guild of this.guilds.values()) {
        guild.fetchAllMembers();
      }
    });

    this.on("messageCreate", async msg => {
      if (msg.author.bot || !msg.guild) return;
      if (!msg.channel.memberHasPermission(msg.guild.me, "sendMessages") ||
        !msg.channel.memberHasPermission(msg.guild.me, "embedLinks")) return;
      
      const lang = this.languages.get((await db.languages.findOrCreate({ where: { user: msg.author.id } }))[0].lang);
      const prefix = await db.prefixes.findOne({ where: { server: msg.guild.id } })
        .then(p => p && p.prefix) || this.prefix;

      if (msg.content.replace("<@!", "<@") === this.user.mention) {
        return msg.channel.createMessage(lang.botPrefix(prefix, msg.author));
      }

      if (!msg.content.toLowerCase().startsWith(prefix)) return;

      const blacklistItem = await db.blacklist.findOne({ where: { user: msg.author.id } });
      if (blacklistItem && blacklistItem.blacklisted) return;

      const args = this._parseArgs(msg.content);

      args.raw = msg.content.slice(prefix.length).split(/ +/g);
      args.raw.shift();

      const cmdName = args.shift().toLowerCase().slice(prefix.length);
      
      const command = this.commands.find(cmd => cmd.name === cmdName || (cmd.aliases && cmd.aliases.includes(cmdName)));
      if (!command) return;

      if (command.ownerOnly && this.owners.indexOf(msg.author.id) === -1) return;

      if (command.cooldown) {
        if (!this.cooldowns.has(command.name)) {
          this.cooldowns.set(command.name, new Eris.Collection());
        }

        let cmdCooldowns = this.cooldowns.get(command.name);
        let now = Date.now();
        if (cmdCooldowns.has(msg.author.id)) {
          let expiration = cmdCooldowns.get(msg.author.id) + (command.cooldown * 1000);
          if (now < expiration) {
            let secsLeft = Math.floor((expiration - now) / 1000);
            return msg.channel.createMessage(lang.cooldown(secsLeft));
          }
        }
      }

      try {
        if (command.requiredPermissions) validatePermission(msg.member, command.requiredPermissions);
        await command.run(this, msg, args, prefix, lang);
        if (command.cooldown) {
          let cmdCooldowns = this.cooldowns.get(command.name);
          cmdCooldowns.set(msg.author.id, Date.now());
          setTimeout(() => cmdCooldowns.delete(msg.author.id), command.cooldown * 1000);
        }
        this.logger.info(`${msg.author.username}#${msg.author.discriminator} used ${cmdName} command in ${msg.channel.guild ? msg.channel.guild.name : "bot DM"}`);
      } catch (err) {
        this.emit("commandError", cmdName, msg, err, true, lang);
      } 
    });
    
    this.logger.info("client initialized.");
  }

  _parseArgs(str) {
    let args = [];

    while (str.length) {
      let arg;
      if (str.startsWith('"') && str.indexOf('"', 1) > 0) {
        arg = str.slice(1, str.indexOf('"', 1));
        str = str.slice(str.indexOf('"', 1) + 1);
      } else {
        arg = str.split(/\s+/g)[0].trim();
        str = str.slice(arg.length);
      }
      args.push(arg.trim())
      str = str.trim()
    }

    return args;
  }

  _loadLanguages() {
    let languages = new Eris.Collection();

    let englishLang = require("../languages/en");
    languages.set("en", englishLang);

    const files = fs.readdirSync(path.join(__dirname, "../languages"))
      .filter(f => f.endsWith(".js") || f !== "en.js");
    for (let file of files) {
      let langName = file.replace(".js", "");
      let lang = require(`../languages/${file}`);

      for (let key in englishLang) {
        if (lang[key]) continue;
        lang[key] = englishLang[key];
      }
    
      languages.set(langName, lang);
      this.logger.debug(`loaded ${langName} language.`);
    }
    
    this.logger.info("successfully loaded all language files.");
    return languages;
  }

  loadCommand(path) {
    const command = require(path);
    if (!this.groups.has(command.group)) {
      if (command.group)
        this.groups.set(command.group, new Group(this, command.group));
      else this.groups.set("Uncategorized", new Group(this, "Uncategorized"));
    }

    command.path = path;

    this.commands.set(command.name, command);
    this.logger.debug(`successfully loaded ${command.name} command.`);
  }

  loadCommandGroup(groupPath) {
    const commands = fs.readdirSync(groupPath).filter(f => f.endsWith("js"));

    for (const command of commands) {
      this.loadCommand(path.join(groupPath, command));
    }
  }

  reloadCommand(name) {
    if (!this.commands.has(name)) {
      throw new Error("command doesn't exist.");
    }
    
    const { path: cmdPath } = this.commands.get(name);

    this.unloadCommand(name);
    this.loadCommand(cmdPath);
  }

  unloadCommand(name) {
    if (!this.commands.has(name)) {
      throw new Error("command doesn't exist.");
    }

    let cmd = this.commands.get(name);
    let cmdPath = require.resolve(cmd.path);

    delete require.cache[cmdPath];
    this.commands.delete(name);
  }

  reloadLanguages() {
    for (let lang of this.languages.keys()) {
      let cmdPath = require.resolve(`../languages/${lang}`);
      delete require.cache[cmdPath];
    }

    this.languages.clear();

    this.languages = this._loadLanguages();
  }

  async fetchUser(userID) {
    const user = await this.requestHandler.request("GET", `/users/${userID}`, true);
    return new Eris.User(user, this);
  }

  async connect() {
    this.logger.info("trying to login now...");
    return super.connect();
  }

  loadExtension(extPath, ...args) {
    const ext = require(extPath);

    if (!ext.load) throw new Error("extension should export a load() method.");
    if (!ext.unload) throw new Error("extension should export a unload() method.");

    ext.load(this, ...args);

    this.extensions[extPath] = ext;

    this.logger.debug(`loaded extension ${extPath}.`);
  }

  reloadExtension(extPath, ...args) {
    this.unloadExtension(extPath);
    this.loadExtension(extPath, ...args);
  }

  unloadExtension(extPath) {
    if (!this.extensions[extPath]) {
      throw new Error("extension not loaded or doesn't exist.");
    }

    const ext = this.extensions[extPath];
    ext.unload(this);

    const fullPath = require.resolve(extPath);

    delete require.cache[fullPath];
    delete this.extensions[extPath];

    this.logger.debug(`unloaded extension ${extPath}.`);
  }
}

CmdClient.PermissionError = PermissionError;
CmdClient.Group = Group;
CmdClient.Logger = Logger;
CmdClient.Eris = Eris;

module.exports = CmdClient;
