module.exports = {
	name: "kotletki",
	group: "Basic",
	description: "котлетки",
	hidden: true,
	async run(client, msg, args, prefix) {
		await msg.channel.createMessage("kotletki");
	}
};
