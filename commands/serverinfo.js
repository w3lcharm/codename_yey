const Discord = require("discord.js");

module.exports = {
	name: "serverinfo",
	description: "Показывает информацию о сервере.",
	guildOnly: true,
	async run(client, msg, args, prefix) {
		const embed = new Discord.RichEmbed()
			.setTitle(msg.guild.name)
			.setColor("RANDOM")
			.setThumbnail(msg.guild.iconURL)
			.addField("Владелец сервера:", msg.guild.owner)
			.addField("ID:", msg.guild.id)
			.addField("Регион:", msg.guild.region)
			.addField("Всего участников:", msg.guild.memberCount)
			.addField("Всего каналов:", msg.guild.channels.size)
			.addField("Всего ролей:", msg.guild.roles.size)
			.addField("Дата создания:", msg.guild.createdAt);
		await msg.channel.send(embed);
	}
}
