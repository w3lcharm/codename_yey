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

		let avatarURL = member.user.displayAvatarURL({ size: 2048 });
		if (member.user.avatar && member.user.avatar.startsWith("a_"))
			avatarURL = avatarURL.replace(".webp", ".gif");

		const embed = new Discord.MessageEmbed()
			.setTitle(`${member.user.tag}'s avatar:`)
			.setURL(avatarURL)
			.setColor("RANDOM")
			.setImage(avatarURL);
		
		await msg.channel.send(embed);
	}
}
