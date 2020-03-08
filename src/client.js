const Eris = require("eris");
const fs = require("fs");

const PermissionError = require("./errors/permissionError");

const Group = require("./group");

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

		this.on("messageCreate", async msg => {
			if (!msg.content.startsWith(this.prefix) || msg.author.bot) return;

			const args = this._parseArgs(msg.content.slice(this.prefix.length));
			const commandName = args.shift();

			if (!this.commands.has(commandName)) return;

			const command = this.commands.get(commandName);

			if (command.guildOnly && !msg.channel.guild)
				return msg.channel.createMessage(`> :x: You cannot use this command in DM.`);

			if (command.ownerOnly && this.owners.indexOf(msg.author.id) === -1)
				return;

			try {
				if (command.requiredPermissions) validatePermission(msg.member, command.requiredPermissions);
				await command.run(this, msg, args, this.prefix);
			} catch (err) {
				this.emit("commandError", commandName, msg, err);
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
	}

	loadGroups(groups) {
		for (const dir of groups) {
			const commands = fs.readdirSync(`./src/commands/${dir}`).filter(f => f.endsWith(".js"));
			for (let command of commands)
				this.loadCommand(`./commands/${dir}/${command}`);
		}
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
}

CmdClient.PermissionError = PermissionError;
CmdClient.Group = Group;

module.exports = CmdClient;
