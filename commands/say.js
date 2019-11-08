const Discord = require("discord.js");

module.exports = {
	name: "say",
	description: "Посылает ваш текст.",
	usage: "<текст>",
	async run(client, msg, args, prefix) {
		const text = args.join(" ");
		if (!text.length)
			return msg.reply("я не смогу сказать пустой текст");

		const embed = new Discord.RichEmbed()
			.setDescription(text)
			.setColor("RANDOM")
			.setFooter(msg.author.tag, msg.author.avatarURL || msg.author.defaultAvatarURL);
		
		if (msg.guild.me.hasPermission("MANAGE_MESSAGES"))
			msg.delete();
		else
			msg.channel.send("Пожалуйста, выдайте мне разрешение \"Управлять сообщениями\" для корректной работы этой команды ")
		await msg.channel.send(embed);
	}
}
