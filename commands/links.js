const Discord = require("discord.js");

module.exports = {
	name: "links",
	description: "Bot's links",
	async run(client, msg, args, prefix) {
		const embed = new Discord.RichEmbed()
			.setTitle("Links:")
			.setDescription("[codename_yey server](https://discord.gg/kWTNd4F)\n[Invite me to your server](https://discordapp.com/api/oauth2/authorize?client_id=641312878804074497&permissions=8&scope=bot)")
			.setColor("RANDOM")
			.setFooter("codename_yey", client.user.avatarURL || client.user.defaultAvatarURL);
		await msg.channel.send(embed);
	}
};
