const { CategoryChannel, TextChannel, VoiceChannel } = require("eris");

module.exports = {
	name: "server",
	group: "Basic",
	description: "Shows info about server.",
	guildOnly: true,
	async run(client, msg, args, prefix) {
		const owner = client.users.get(msg.guild.ownerID);

		const createdDaysAgo = Math.floor((Date.now() - msg.guild.createdAt) / (1000 * 86400));

		const embed = {
			title: msg.guild.name,
			thumbnail: { url: msg.guild.iconURL },
			color: Math.round(Math.random() * 16777216) + 1,
			fields: [
				{
					name: "Owner:",
					value: `${owner.username}#${owner.discriminator}`,
					inline: true,
				},
				{
					name: "ID:",
					value: msg.guild.id,
					inline: true,
				},
				{
					name: "Region:",
					value: msg.guild.region,
					inline: true,
				},
				{
					name: "Members:",
					value: `**total** - ${msg.guild.memberCount}\n` +
						`**bots** - ${msg.guild.members.filter(m => m.bot).length}\n` +
						`**online** - ${msg.guild.members.filter(m => m.status === "online").length}\n` +
						`**idle** - ${msg.guild.members.filter(m => m.status === "idle").length}\n` +
						`**DND** - ${msg.guild.members.filter(m => m.status === "dnd").length}\n` +
						`**offline** - ${msg.guild.members.filter(m => m.status === "offline").length}`,
					inline: true,
				},
				{
					name: "Channels:",
					value: `**categories** - ${msg.guild.channels.filter(c => c instanceof CategoryChannel).length}\n` +
						`**text** - ${msg.guild.channels.filter(c => c instanceof TextChannel).length}\n` +
						`**voice** - ${msg.guild.channels.filter(c => c instanceof VoiceChannel).length}`,
					inline: true,
				},
				{
					name: "Total roles:",
					value: msg.guild.roles.size,
					inline: true,
				},
				{
					name: "Created at:",
					value: `${new Date(msg.guild.createdAt).toLocaleString()} (${createdDaysAgo} days ago)`,
					inline: true,
				},
			]
		}

		await msg.channel.createMessage({ embed });
	}
};
