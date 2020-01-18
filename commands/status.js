const Discord = require("discord.js");

function parseUptime(time) {
	const obj = new Date(time);

	let days = obj.getUTCDate() - 1;
	let hours = obj.getUTCHours();
	let minutes = obj.getUTCMinutes();
	let seconds = obj.getUTCSeconds();

	if (hours < 10) hours = "0" + hours;
	if (minutes < 10) minutes = "0" + minutes;
	if (seconds < 10) seconds = "0" + seconds;

	return `${days}:${hours}:${minutes}:${seconds}`;
}

module.exports = {
	name: "status",
	description: "Shows the bot's status.",
	async run(client, msg, args, prefix) {
		const embed = new Discord.MessageEmbed()
			.setTitle("Status:")
			.setColor("RANDOM")
			.addField("Uptime:", parseUptime(client.uptime))
			.addField("Total servers:", client.guilds.size)
			.addField("Platform:", process.platform)
			.addField("Total users:", client.users.size)
			.addField("Versions:", `**discord.js**: ${Discord.version}\n**Node.js**: ${process.version}`)
			.setFooter("codename_yey (c) GDRadio, 2020", client.user.displayAvatarURL);
		await msg.channel.send(embed);
	}
};
