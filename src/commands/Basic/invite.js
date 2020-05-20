module.exports = {
	name: "invite",
	group: "basicGroup",
	description: "inviteDescription",
	async run(client, msg, args, prefix, lang) {
		const embed = {
			title: lang.inviteBotInvite,
			description: `[${lang.clickHere}](https://discordapp.com/api/oauth2/authorize?client_id=641312878804074497&permissions=8&scope=bot)`,
			color: Math.round(Math.random() * 16777216) + 1,
			footer: {
				text: "codename_yey",
				icon_url: client.user.avatarURL,
			},
			fields: [
				{
					name: lang.inviteSupportServer,
					value: `[${lang.clickHere}](https://discord.gg/JGXB5sK)`,
				},
			],
		};

		await msg.channel.createMessage({ embed: embed });
	}
};
