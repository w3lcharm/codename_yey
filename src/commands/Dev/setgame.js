module.exports = {
	name: "setgame",
	group: "devGroup",
	description: "setgameDescription",
	usage: "setgameUsage",
	ownerOnly: true,
	hidden: true,
	async run(client, msg, args, prefix, lang) {
		if (!args.length)
			return msg.channel.createMessage(lang.commandUsage(prefix, this));
		
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
