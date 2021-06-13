const fs = require("fs");
const path = require("path");

const Eris = require("eris-additions")(require("eris"));
const Sequelize = require("sequelize");

const PermissionError = require("./errors/PermissionError");

const Group = require("./Group");
const Logger = require("./Logger");

const initDB = require("./initDB");

class CmdClient extends Eris.Client {
  constructor(token, options = {}) {
    super(token, options);
    this.prefix = options.prefix || "!";
    this.owners = options.owners || [];

    this.commands = new Eris.Collection();
    this.groups = new Eris.Collection();

    this.debugMode = options.debugMode || false;

    this.logger = new Logger(options.debugMode ? Logger.TRACE : Logger.INFO, "Main");
    this.commandLogger = new Logger(Logger.INFO, "CommandHandler");
    this.extensionLogger = new Logger(Logger.INFO, "ExtensionsHandler");
    this.logger.info("Loggers are initialized.");

    this.languages = this._loadLanguages();

    this.cooldowns = new Eris.Collection();

    this.extensions = {};

    this.middlewares = [];

    /* this.sequelizeLogger = new Logger(this.debugMode ? Logger.TRACE : Logger.INFO, "sequelize");
    global.sequelize = new Sequelize(options.db.database, options.db.username, options.db.password, {
      host: options.db.localhost,
      dialect: options.db.dialect,
      storage: options.db.storage,
      dialectOptions: { timezone: "Etc/GMT0" },
      logging: (...msg) => this.sequelizeLogger.debug(msg),
    });
    global.db = initDB(sequelize, Sequelize.DataTypes); */

    if (options.debugMode) {
      this._erisLogger = new Logger(Logger.TRACE, "eris");
      this.on("debug", msg => this._erisLogger.debug(msg));
    }

    this.once("ready", async () => {
      this.logger.info(`Connected successfully as ${this.user.username}.`);
      this.editStatus("online", { name: `type @${client.user.username}` });

      /* for (const guild of this.guilds.values()) {
        await guild.fetchAllMembers();
      } */
    });

    this.on("messageCreate", async msg => {
      if (msg.author.bot || !msg.guild) return;
      if (!msg.channel.memberHasPermission(msg.guild.me, "sendMessages") ||
        !msg.channel.memberHasPermission(msg.guild.me, "embedLinks")) return;

      await this.handleCommand(msg);
    });
    
    this.logger.info("Client initialized.");
  }

  async handleCommand(msg) {
    const prefix = this.prefix instanceof Function ?
      await this.prefix(this, msg) : this.prefix;

    let data = [];
    for (const middleware of this.middlewares) {
      const value = await middleware(msg, prefix, data);
      if (!value) return;
      data.push(value); 
    }
  
    if (!msg.content.toLowerCase().startsWith(prefix)) return;

      /* const blacklistItem = await db.blacklist.findOne({ where: { user: msg.author.id } });
      if (blacklistItem && blacklistItem.blacklisted) return; */

    const args = this._parseArgs(msg.content);

    args.raw = msg.content.split(/ +/g);
    args.raw.shift();

    const cmdName = args.shift().toLowerCase().slice(prefix.length);
      
    const command = this.commands.find(cmd => cmd.name === cmdName || (cmd.aliases && cmd.aliases.includes(cmdName)));
    if (!command) return;

    if (command.ownerOnly && !this.owners.includes(msg.author.id)) return;

    if (command.argsRequired && !args.length && !msg.attachments.length) {
      return this.commands.get("help").run(this, msg, [ command.name ], prefix, ...data);
    }

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
          return this.emit("commandCooldown", command, msg, secsLeft);
        }
      }
    }

    try {
      if (command.requiredPermissions) this._validatePermission(msg.member, command.requiredPermissions);
      await command.run(this, msg, args, prefix, ...data);
      if (command.cooldown) {
        let cmdCooldowns = this.cooldowns.get(command.name);
        cmdCooldowns.set(msg.author.id, Date.now());
        setTimeout(() => cmdCooldowns.delete(msg.author.id), command.cooldown * 1000);
      }

      this.emit("commandSuccess", command, msg);
    } catch (err) {
      this.emit("commandError", command, msg, err, true, ...data);
    } 
  }

  _validatePermission(member, permissions) {
    if (permissions instanceof Array) {
      for (const permission of permissions) {
        const hasPermission = member.permissions.has(permission);
        if (!hasPermission)
          throw new PermissionError("missing permission.", permission);
      }
    } else {
      const hasPermission = member.permissions.has(permissions);
      if (!hasPermission)
        throw new PermissionError("missing permission.", permissions);
    }
  }

  addMiddleware(func) {
    if (!(func instanceof Function)) {
      throw new TypeError(`argument should be a function, received ${typeof func}`);
    }

    this.middlewares.push(func);
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
    
      languages.set(langName, lang);
      this.logger.debug(`loaded ${langName} language.`);
    }
    
    this.logger.info("Successfully loaded all language files.");
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
    this.commandLogger.info(`Successfully loaded command ${command.name}.`);
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

    this.commandLogger.info(`Unloaded command ${name}`);
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
    try {
      const user = await this.requestHandler.request("GET", `/users/${userID}`, true);
      return new Eris.User(user, this);
    } catch {}
  }

  async connect() {
    this.logger.info("Connecting...");
    return super.connect();
  }

  loadExtension(extPath, ...args) {
    const ext = require(extPath);

    if (!ext.load) throw new Error("extension should export a load() method.");

    ext.load(this, ...args);
    ext.path = extPath;
    ext.name = path.parse(path.basename(extPath)).name;

    this.extensions[ext.name] = ext;

    this.extensionLogger.info(`Loaded extension ${extPath}.`);
  }

  reloadExtension(name, ...args) {
    const extPath = this.unloadExtension(name);
    this.loadExtension(extPath, ...args);
  }

  unloadExtension(extPath) {
    if (!this.extensions[extPath]) {
      throw new Error("extension not loaded or doesn't exist.");
    }

    const ext = this.extensions[extPath];
    if (ext.unload) ext.unload(this);

    const fullPath = require.resolve(ext.path);

    delete require.cache[fullPath];
    delete this.extensions[ext];

    this.extensionLogger.info(`Unloaded extension ${extPath}.`);
    return ext.path;
  }

  async getAppInfo() {
    return this.requestHandler.request("GET", "/oauth2/applications/@me", true);
  }

  async getInviteLink(permissions) {
    const appInfo = await this.getAppInfo();

    let link = `https://discord.com/api/oauth2/authorize?client_id=${appInfo.id}&scope=bot`;
    if (permissions) link += `&permissions=${permissions}`;

    return link;
  } 
}

CmdClient.PermissionError = PermissionError;
CmdClient.Group = Group;
CmdClient.Logger = Logger;
CmdClient.Eris = Eris;

module.exports = CmdClient;
