const { CategoryChannel, TextChannel, VoiceChannel } = require("eris");

module.exports = {
	name: "serverinfo",
	group: "Basic",
	description: "Shows info about server.",
	guildOnly: true,
	async run(client, msg, args, prefix) {
		const owner = client.users.get(msg.channel.guild.ownerID);

		const embed = {
			title: msg.channel.guild.name,
			thumbnail: { url: msg.channel.guild.iconURL },
			color: Math.round(Math.random() * 16777216) + 1,
			fields: [
				{
					name: "Owner:",
					value: `${owner.username}#${owner.discriminator}`,
					inline: true,
				},
				{
					name: "ID:",
					value: msg.channel.guild.id,
					inline: true,
				},
				{
					name: "Region:",
					value: msg.channel.guild.region,
					inline: true,
				},
				{
					name: "Members:",
					value: `**total** - ${msg.channel.guild.memberCount}\n` +
						`**online** - ${msg.channel.guild.members.filter(m => m.status === "online").length}\n` +
						`**idle** - ${msg.channel.guild.members.filter(m => m.status === "idle").length}\n` +
						`**DND** - ${msg.channel.guild.members.filter(m => m.status === "dnd").length}\n` +
						`**offline** - ${msg.channel.guild.members.filter(m => m.status === "offline").length}`,
					inline: true,
				},
				{
					name: "Channels:",
					value: `**categories** - ${msg.channel.guild.channels.filter(c => c instanceof CategoryChannel).length}\n` +
						`**text** - ${msg.channel.guild.channels.filter(c => c instanceof TextChannel).length}\n` +
						`**voice** - ${msg.channel.guild.channels.filter(c => c instanceof VoiceChannel).length}`,
					inline: true,
				},
				{
					name: "Total roles:",
					value: msg.channel.guild.roles.size,
					inline: true,
				},
				{
					name: "Created at:",
					value: new Date(msg.channel.guild.createdAt).toLocaleString(),
					inline: true,
				},
			]
		}

		await msg.channel.createMessage({ embed: embed });
	}
};
