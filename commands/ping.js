const Discord = require("discord.js");

module.exports = {
	name: "ping",
	description: "Measures the bot latency and shows the API latency.",
	async run(client, msg, args, prefix) {
		startTime = Date.now();
		m = await msg.channel.send("Measuring...");
		const embed = new Discord.RichEmbed()
			.setTitle(`Bot latency is ${Date.now() - startTime} ms.`)
			.setDescription(`API latency is ${Math.floor(client.ping)} ms.`)
			.setFooter("codename_yey", client.user.displayAvatarURL)
			.setColor("RANDOM");
		await m.edit("", embed)
	}
};

