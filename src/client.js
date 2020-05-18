const Eris = require("eris-additions")(require("eris"));
const fs = require("fs");

const PermissionError = require("./errors/permissionError");

const Group = require("./group");
const Logger = require("./logger");

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

function loadLanguages() {
	const languages = {};

	const langFiles = fs.readdirSync("./src/languages").filter(f => f.endsWith(".js"));
	for (let file of langFiles) {
		const fileWithoutExtension = file.replace(".js", "");

		const lang = require(`./languages/${file}`);
		languages[fileWithoutExtension] = lang;
	}

	return languages;
}

class CmdClient extends Eris.Client {
	constructor(token, options = {}) {
		super(token, options);
		this.prefix = options.prefix || "!";
		this.owners = options.owners || [];

		this.commands = new Eris.Collection();
		this.groups = new Eris.Collection();
		this.languages = loadLanguages();

		this.debugMode = options.debugMode || false;

		this.logger = new Logger(options.debugMode ? Logger.TRACE : Logger.INFO, "codename_yey");
		if (options.debugMode) {
			this._erisLogger = new Logger(Logger.TRACE, "eris");
			this.on("debug", msg => this._erisLogger.debug(msg));
		}

		this.on("messageCreate", async msg => {
			if (!msg.content.toLowerCase().startsWith(this.prefix) || msg.author.bot) return;
			const args = this._parseArgs(msg.content);
			const commandName = args.shift().toLowerCase().slice(this.prefix.length);
			if (!this.commands.has(commandName)) return;

			const command = this.commands.get(commandName);
			const lang = this.languages[(await languages.findOrCreate({ where: { user: msg.author.id } }))[0].lang];

			if (command.guildOnly && !msg.channel.guild)
				return msg.channel.createMessage(lang.cantUseCommandInDM);

			if (command.ownerOnly && this.owners.indexOf(msg.author.id) === -1)
				return;

			try {
				if (command.requiredPermissions) validatePermission(msg.member, command.requiredPermissions);
				await command.run(this, msg, args, this.prefix, lang);
				this.logger.info(`${msg.author.username}#${msg.author.discriminator} used ${commandName} command in ${msg.channel.guild ? msg.channel.guild.name : "bot DM"}`);
			} catch (err) {
				this.emit("commandError", commandName, msg, err, true);
			} 
		});
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

	loadCommand(path) {
		const command = require(path);
		if (!this.groups.has(command.group)) {
			if (command.group)
				this.groups.set(command.group, new Group(this, command.group));
			else this.groups.set("Uncategorized", new Group(this, "Uncategorized"));
		}

		this.commands.set(command.name, command);
		this.logger.debug(`successfully loaded ${command.name} command.`);
	}

	loadGroups(groups) {
		this.logger.info("loading the commands...")
		for (const dir of groups) {
			const commands = fs.readdirSync(`./src/commands/${dir}`).filter(f => f.endsWith(".js"));
			for (let command of commands)
				this.loadCommand(`./commands/${dir}/${command}`);
		}
		this.logger.info(`successfully loaded all commands.`);
	}

	reloadCommand(commandName) {
		const command = this.commands.get(commandName);
		if (!command)
			throw new Error("command does not exist.");

		const pathToCommand = require.resolve(`./commands/${command.group}/${commandName}`);
		delete require.cache[pathToCommand];

		this.commands.delete(commandName);
		this.loadCommand(pathToCommand);
	}

	async connect() {
		this.logger.info("trying to login now...");
		return super.connect();
	}
}

CmdClient.PermissionError = PermissionError;
CmdClient.Group = Group;
CmdClient.Logger = Logger;

module.exports = CmdClient;
