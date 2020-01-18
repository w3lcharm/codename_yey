const Discord = require("discord.js");

module.exports = {
	name: "avatar",
	description: "Shows your avatar or the mentioned user's avatar.",
	usage: "[user]",
	async run(client, msg, args, prefix) {
		let member;
		if (!args.length)
			member = msg.guild.member(msg.author);
		else
			member = msg.mentions.members.first() || msg.guild.member(client.users.find(u => u.id == args[0] || u.tag == args[0]));

		if (!member) return;

		const embed = new Discord.MessageEmbed()
			.setTitle(`${member.user.tag}'s avatar:`)
			.setColor("RANDOM")
			.setImage(member.user.displayAvatarURL());
		
		await msg.channel.send(embed);
	}
}
