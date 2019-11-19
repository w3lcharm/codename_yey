const Discord = require("discord.js");

module.exports = {
	name: "serverinfo",
	description: "Shows the info about a server",
	guildOnly: true,
	async run(client, msg, args, prefix) {
		const embed = new Discord.RichEmbed()
			.setTitle(msg.guild.name)
			.setColor("RANDOM")
			.setThumbnail(msg.guild.iconURL)
			.addField("Owner:", msg.guild.owner)
			.addField("ID:", msg.guild.id)
			.addField("Voice region:", msg.guild.region)
			.addField("Total members:", msg.guild.memberCount)
			.addField("Total channels:", msg.guild.channels.size)
			.addField("Total roles:", msg.guild.roles.size)
			.addField("Created at:", msg.guild.createdAt);
		await msg.channel.send(embed);
	}
}
