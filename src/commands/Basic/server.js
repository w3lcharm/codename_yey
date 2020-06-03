const { CategoryChannel, TextChannel, VoiceChannel } = require("eris");
const moment = require("moment");

module.exports = {
	name: "server",
	group: "basicGroup",
	description: "serverDescription",
	guildOnly: true,
	async run(client, msg, args, prefix, lang) {
		moment.locale(lang.langName);
		const owner = client.users.get(msg.guild.ownerID);

		const createdDaysAgo = Math.floor((Date.now() - msg.guild.createdAt) / (1000 * 86400));

		const embed = {
			title: msg.guild.name,
			thumbnail: { url: msg.guild.iconURL },
			color: Math.round(Math.random() * 16777216) + 1,
			fields: [
				{
					name: lang.serverOwner,
					value: owner.tag,
					inline: true,
				},
				{
					name: "ID:",
					value: msg.guild.id,
					inline: true,
				},
				{
					name: lang.serverRegion,
					value: msg.guild.region,
					inline: true,
				},
				{
					name: lang.serverMembers,
					value: `**${lang.serverMembersTotal}** - ${msg.guild.memberCount}\n` +
						`**${lang.serverMembersBots}** - ${msg.guild.members.filter(m => m.bot).length}\n` +
						`**${lang.serverMembersOnline}** - ${msg.guild.members.filter(m => m.status === "online").length}\n` +
						`**${lang.serverMembersIdle}** - ${msg.guild.members.filter(m => m.status === "idle").length}\n` +
						`**${lang.serverMembersDND}** - ${msg.guild.members.filter(m => m.status === "dnd").length}\n` +
						`**${lang.serverMembersOffline}** - ${msg.guild.members.filter(m => m.status === "offline").length}`,
					inline: true,
				},
				{
					name: lang.serverChannels,
					value: `**${lang.serverChannelsCategories}** - ${msg.guild.channels.filter(c => c instanceof CategoryChannel).length}\n` +
						`**${lang.serverChannelsText}** - ${msg.guild.channels.filter(c => c instanceof TextChannel).length}\n` +
						`**${lang.serverChannelsVoice}** - ${msg.guild.channels.filter(c => c instanceof VoiceChannel).length}`,
					inline: true,
				},
				{
					name: lang.serverTotalRoles,
					value: msg.guild.roles.size,
					inline: true,
				},
				{
					name: lang.serverCreatedAt,
					value: `${moment(msg.guild.createdAt).format("lll")} ${lang.daysAgo(createdDaysAgo)}`,
					inline: true,
				},
			]
		}

		await msg.channel.createMessage({ embed });
	}
};
