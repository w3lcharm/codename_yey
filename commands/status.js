const Discord = require("discord.js");

function parseUptime(time) {
	obj = new Date(time);
	days = obj.getUTCDate() - 1;
	hours = obj.getUTCHours();
	minutes = obj.getUTCMinutes();
	seconds = obj.getUTCSeconds();
	return `${days}:${hours}:${minutes}:${seconds}`;
}

module.exports = {
	name: "status",
	description: "Показывает статус бота.",
	async run(client, msg, args, prefix) {
		const embed = new Discord.RichEmbed()
			.setTitle("Статус")
			.setColor("RANDOM")
			.addField("Аптайм:", parseUptime(client.uptime))
			.addField("Серверов:", client.guilds.size)
			.addField("Пользователей:", client.users.size)
			.addField("Версии:", `**бота**: 0.1.0-alpha\n**discord.js**: ${Discord.version}\n**Node.js**: ${process.version}`)
			.setFooter("codename_yey (c) GDRadio, 2019", client.user.avatarURL || client.user.defaultAvatarURL);
		await msg.channel.send(embed);
	}
};
