const Discord = require("discord.js");

module.exports = {
	name: "ban",
	description: "Bans the mentioned user.\nYou must have a \"Ban members\" permission to use this command.",
	guildOnly: true,
	usage: "<user> [reason]",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		const userID = args.shift();
		const reason = args.join(" ");

		let member = msg.mentions.members.first() || msg.guild.member(client.users.find(u => u.tag == userID || u.id == userID));

		if (!member) return;
		
		if (msg.guild.member(msg.author).hasPermission("BAN_MEMBERS")) {
			if (!msg.guild.me.hasPermission("BAN_MEMBERS"))
				return msg.channel.send("> :x: I don't have the permissions to do this. Please give me the \"Ban members\" permissions and try again.");
			if (member.user.id == msg.author.id)
				return msg.channel.send("> :x: You can't ban yourself.");
			if (member.user.id == client.user.id)
				return msg.channel.send("> :x: You can't ban a bot.");
			if (member.kickable) {
				await member.ban(reason);

				const embed = new Discord.RichEmbed()
					.setAuthor(`${member.user.tag} was banned`, member.user.displayAvatarURL)
					.addField("Reason:", reason || 'not provided')
					.setColor("GREEN")
					.setTimestamp();
			
				await msg.channel.send(embed);
			} else {
				return msg.channel.send("> :x: I can't ban this user.");
			}
		} else {
			await msg.channel.send("> :x: You don't have permissions to use this command.");
		}
	}
}
