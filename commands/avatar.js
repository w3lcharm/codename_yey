const Discord = require("discord.js");

module.exports = {
	name: "avatar",
	description: "Показывает ваш аватар или аватар упомянктого пользователя.",
	usage: "[пользователь]",
	async run(client, msg, args, prefix) {
		let member;
		if (!args.length)
			member = msg.guild.member(msg.author);
		else
			member = msg.mentions.members.first() || msg.guild.member(client.users.find(u => u.id == args[0]));

		if (member == undefined) return;

		const embed = new Discord.RichEmbed()
			.setTitle(`Аватар ${member.user.tag}:`)
			.setColor("RANDOM")
			.setImage(member.user.avatarURL || member.user.defaultAvatarURL);
		
		await msg.channel.send(embed);
	}
}
