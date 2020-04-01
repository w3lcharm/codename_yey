module.exports = {
	name: "invite",
	group: "Basic",
	description: "Bot invite link",
	async run(client, msg, args, prefix) {
		const embed = {
			title: "Bot invite link:",
			description: "[(click here)](https://discordapp.com/api/oauth2/authorize?client_id=641312878804074497&permissions=8&scope=bot)",
			color: Math.round(Math.random() * 16777216) + 1,
			footer: {
				text: "codename_yey",
				icon_url: client.user.avatarURL,
			},
			fields: [
				{
					name: "codename_yey server:",
					value: "[(click here)](https://discord.gg/JGXB5sK)"
				},
			],
		};

		await msg.channel.createMessage({ embed: embed });
	}
};
