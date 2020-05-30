module.exports = {
	name: "user",
	group: "basicGroup",
	description: "userDescription",
	usage: "userUsage",
	guildOnly: true,
	async run(client, msg, args, prefix, lang) {
		let member;
		let userID = args[0];
		if (!userID) member = msg.member;
		else member = msg.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") ||
			msg.guild.members.find(m => m.id === userID || m.tag === userID) ||
			client.users.find(u => u.id === userID || u.tag === userID);

		if (!member) return;

		let name = `${member.username}#${member.discriminator}`;
		if (member.nick) name += ` (${member.nick})`;

		const createdDaysAgo = Math.floor((Date.now() - member.createdAt) / (1000 * 86400));
		const joinedDaysAgo = Math.floor((Date.now() - member.joinedAt) / (1000 * 86400));

		const embed = {
			author: {
				name,
				icon_url: member.avatarURL,
			},
			color: Math.round(Math.random() * 16777216) + 1,
			fields: [
				{
					name: lang.userStatus,
					value: member.status || "offline",
				},
				{
					name: "ID:",
					value: member.id,
				},
				{
					name: lang.userRegisteredAt,
					value: `${new Date(member.createdAt).toLocaleString()} ${lang.daysAgo(createdDaysAgo)}`,
				},
				{
					name: lang.userJoinedAt,
					value: member.joinedAt ? `${new Date(member.joinedAt).toLocaleString()} ${lang.daysAgo(joinedDaysAgo)}` : "n/a",
				},
				{
					name: lang.userRoles,
					value: member.roles ? member.roles.map(r => `<@&${r}>`).join(", ") || "None" : "n/a",
				},
				{
					name: lang.userBot,
					value: lang.userBotDefine(member.bot),
				},
			],
		};

		if (member.game) {
			let emoji;
			if (member.game.emoji) {
				let animated = member.game.emoji.animated ? "a" : "";
				if (member.game.emoji.id) {
					emoji = `<${animated}:${member.game.emoji.name}:${member.game.emoji.id}>`;
				} else {
					emoji = member.game.emoji.name;
				}
			}

			switch (member.game.type) {
				case 4:
					embed.fields.unshift({
						name: lang.userCustomStatus,
						value: emoji ? `${emoji} ${member.game.state || ""}` : member.game.state,
					});
					break;
				case 3:
					embed.fields.unshift({
						name: lang.userWatching,
						value: member.game.name,
					});
					break;
				case 2:
					embed.fields.unshift({
						name: lang.userListening,
						value: member.game.name,
					});
					break;
				case 1:
					embed.fields.unshift({
						name: lang.userStreaming,
						value: `[${member.game.name}](${member.game.url})`,
					});
					break;
				case 0:
					embed.fields.unshift({
						name: lang.userPlaying,
						value: member.game.name,
					});
					break;
			}
		}

		await msg.channel.createMessage({ embed: embed });
	}
};
