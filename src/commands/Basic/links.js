module.exports = {
	name: "links",
	group: "Basic",
	description: "Some useful links",
	async run(client, msg, args, prefix) {
		const embed = {
			title: "Links:",
			description: "[codename_yey server](https://discord.gg/JGXB5sK)\n" +
				"[Bot invite link](https://discordapp.com/api/oauth2/authorize?client_id=641312878804074497&permissions=8&scope=bot)",
			color: Math.round(Math.random() * 16777216) + 1,
			footer: {
				text: "codename_yey",
				icon_url: client.user.avatarURL,
			},
		};

		await msg.channel.createMessage({ embed: embed });
	}
};
