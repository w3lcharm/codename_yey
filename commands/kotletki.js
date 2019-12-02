const Discord = require("discord.js");

module.exports = {
	name: "kotletki",
	description: "котлетки",
	hidden: true,
	async run(client, msg, args, prefix) {
		await msg.channel.send("котлетки");
	}
}
