const Discord = require("discord.js");

module.exports = {
	name: "say",
	description: "Says your text.",
	usage: "<text>",
	async run(client, msg, args, prefix) {
		const text = args.join(" ");
		if (!text.length) return;

		const embed = new Discord.RichEmbed()
			.setDescription(text)
			.setColor("RANDOM")
			.setFooter(msg.author.tag, msg.author.avatarURL || msg.author.defaultAvatarURL);
		
		if (msg.guild.me.hasPermission("MANAGE_MESSAGES"))
			msg.delete();
		else {}
		await msg.channel.send(embed);
	}
}
