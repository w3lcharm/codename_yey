const Discord = require("discord.js");

module.exports = {
	name: "ping",
	description: "Измеряет задержку бота до API.",
	async run(client, msg, args, prefix) {
		startTime = Date.now();
		m = await msg.channel.send("Измеряется...");
		const embed = new Discord.RichEmbed()
			.setTitle(`Задержка бота ${Date.now() - startTime} мс.`)
			.setDescription(`Задержка до API ${client.ping} мс.`)
			.setFooter("codename_yey", client.user.avatarURL)
			.setColor("RANDOM");
		await m.edit("", embed)
	}
};

