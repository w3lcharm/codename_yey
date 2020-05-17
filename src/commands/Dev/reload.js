module.exports = {
	name: "reload",
	group: "Dev",
	description: "Reloads the command.",
	usage: "<command>",
	ownerOnly: true,
	hidden: true,
	async run(client, msg, args, prefix) {
		if (!args.length) {
			return msg.channel.createMessage(`> Usage: \`${prefix}${this.name} ${this.usage}\``);
		}

		const cmd = args[0];
		if (!client.commands.has(cmd)) {
			return msg.channel.createMessage(`> :x: **${command}** command doesn't exist.`);
		}

		client.reloadCommand(cmd);
		await msg.addReaction("✅");
	}
};