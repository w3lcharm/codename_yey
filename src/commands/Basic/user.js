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

		await msg.channel.createMessage({ embed: embed });
	}
};
