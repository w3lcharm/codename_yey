module.exports = {
	name: "user",
	group: "Basic",
	description: "Shows info about you or about provided user.",
	usage: "[user: id or mention]",
	guildOnly: true,
	async run(client, msg, args, prefix) {
		let member;
		let userID = args[0];
		if (!userID) member = msg.member;
		else member = msg.channel.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") || msg.channel.guild.members.find(m => m.id == userID);

		if (!member) return;

		let name = `${member.user.username}#${member.user.discriminator}`;
		if (member.nick) name += ` (${member.nick})`;

		const embed = {
			author: {
				name: name,
				icon_url: member.user.avatarURL,
			},
			color: Math.round(Math.random() * 16777216) + 1,
			fields: [
				{
					name: "Status:",
					value: member.status,
				},
				{
					name: "ID:",
					value: member.user.id,
				},
				{
					name: "Registered at:",
					value: new Date(member.createdAt).toLocaleString(),
				},
				{
					name: "Joined this server at:",
					value: new Date(member.joinedAt).toLocaleString(),
				},
				{
					name: "Roles:",
					value: member.roles.map(r => `<@&${r}>`).join(", ") || "None",
				},
				{
					name: "Bot?",
					value: member.bot ? "Yes" : "No",
				},
			],
		};

		if (member.game) {
			switch (member.game.type) {
				case 4:
					embed.fields.unshift({
						name: "Custom status:",
						value: member.game.emoji ? `${member.game.emoji.name} ${member.game.state || ""}` : member.game.state,
					});
					break;
				case 3:
					embed.fields.unshift({
						name: "Watching:",
						value: member.game.name,
					});
					break;
				case 2:
					embed.fields.unshift({
						name: "Listening to:",
						value: member.game.name,
					});
					break;
				case 1:
					embed.fields.unshift({
						name: "Streaming:",
						value: `[${member.game.name}](${member.game.url})`,
					});
					break;
				case 0:
					embed.fields.unshift({
						name: "Playing:",
						value: member.game.name,
					});
					break;
			}
		}

		await msg.channel.createMessage({ embed: embed });
	}
};
