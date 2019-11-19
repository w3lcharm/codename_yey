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
	description: "Shows the bot's status.",
	async run(client, msg, args, prefix) {
		const embed = new Discord.RichEmbed()
			.setTitle("Status:")
			.setColor("RANDOM")
			.addField("Uptime:", parseUptime(client.uptime))
			.addField("Total servers:", client.guilds.size)
			.addField("Platform:", process.platform)
			.addField("Total users:", client.users.size)
			.addField("Versions:", `**discord.js**: ${Discord.version}\n**Node.js**: ${process.version}`)
			.setFooter("codename_yey (c) GDRadio, 2019", client.user.avatarURL || client.user.defaultAvatarURL);
		await msg.channel.send(embed);
	}
};
