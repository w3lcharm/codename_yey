const Discord = require("discord.js");

module.exports = {
	name: "links",
	description: "Ссылки бота",
	async run(client, msg, args, prefix) {
		const embed = new Discord.RichEmbed()
			.setTitle("Ссылки:")
			.setDescription("[Сервер бота](https://discord.gg/kWTNd4F)\n[Приглашение бота на свой сервер](https://discordapp.com/api/oauth2/authorize?client_id=641312878804074497&permissions=8&scope=bot)")
			.setColor("RANDOM")
			.setFooter("codename_yey", client.user.avatarURL || client.user.defaultAvatarURL);
		await msg.channel.send(embed);
	}
};
