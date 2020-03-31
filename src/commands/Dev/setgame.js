module.exports = {
	name: "setgame",
	group: "Dev",
	description: "Sets the bot's playing/watching/listening status.",
	usage: "[-w|--watching] [-l|--listening] <text>",
	ownerOnly: true,
	hidden: true,
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.createMessage(`> Usage: \`${prefix}${this.name} ${this.usage}\``);
		
		let type = 0;
		if (args[0] === "-w" || args[0] === "--watching") {
			args.shift();
			type = 3;
		}
		if (args[0] === "-l" || args[0] === "--listening") {
			args.shift();
			type = 2;
		}
		const text = args.join(" ");

		client.editStatus("online", { name: text, type });
		await msg.addReaction("✅");
	}
}