const Discord = require("discord.js");

module.exports = {
	name: "serverinfo",
	description: "Shows the info about a server",
	guildOnly: true,
	async run(client, msg, args, prefix) {
		let iconURL = msg.guild.iconURL;
		if (msg.guild.icon != null && msg.guild.icon.startsWith("a_"))
			iconURL = iconURL.replace("jpg", "gif");

		const embed = new Discord.RichEmbed()
			.setTitle(msg.guild.name)
			.setColor("RANDOM")
			.setThumbnail(iconURL)
			.addField("Owner:", msg.guild.owner.user.tag, true)
			.addField("ID:", msg.guild.id, true)
			.addField("Voice region:", msg.guild.region, true)
			.addField("Members:", `**total** - ${msg.guild.memberCount}\n` +
				`**online** - ${msg.guild.members.filter(p => p.presence.status == "online").size}\n` +
				`**idle** - ${msg.guild.members.filter(p => p.presence.status == "idle").size}\n` +
				`**DND** - ${msg.guild.members.filter(p => p.presence.status == "dnd").size}\n` +
				`**offline** - ${msg.guild.members.filter(p => p.presence.status == "offline").size}`, true)
			.addField("Channels:", `**categories** - ${msg.guild.channels.filter(c => c instanceof Discord.CategoryChannel).size}\n` +
				`**text** - ${msg.guild.channels.filter(c => c instanceof Discord.TextChannel).size}\n` +
				`**voice** - ${msg.guild.channels.filter(c => c instanceof Discord.VoiceChannel).size}\n`, true)
			.addField("Roles count:", msg.guild.roles.size, true)
			.addField("Created at:", msg.guild.createdAt);
		await msg.channel.send(embed);
	}
}
