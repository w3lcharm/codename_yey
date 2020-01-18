const Discord = require("discord.js");

module.exports = {
	name: "kick",
	description: "Kicks the mentioned user.\nYou must have the \"Kick members\" permission to use this command.",
	guildOnly: true,
	usage: "<user> [reason]",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		const userID = args.shift();
		const reason = args.join(" ");
		let member = msg.mentions.members.first() || msg.guild.member(client.users.find(u => u.id == userID || u.tag == userID));
		if (!member) return;

		if (msg.guild.member(msg.author).hasPermission("KICK_MEMBERS")) {
			if (!msg.guild.me.hasPermission("KICK_MEMBERS"))
				return msg.channel.send("> :x: I don't have the permissions to do this. Please give me the \"Kick members\" permission and try again.");
			if (member.user.id == msg.author.id)
				return msg.channel.send("> :x: You can't kick yourself.");
			if (member.user.id == client.user.id)
				return msg.channel.send("> :x: You can't kick a bot.");
			if (member.kickable) {
				await member.kick(reason);

				const embed = new Discord.MessageEmbed()
					.setAuthor(`${member.user.tag} was kicked`, member.user.displayAvatarURL())
					.setTitle("Reason:")
					.setDescription(reason || "not provided")
					.setColor("GREEN")
					.setTimestamp();
			
				await msg.channel.send(embed);
			} else {
				return msg.channel.send("> :x: I can't kick this user.");
			}
		} else {
			await msg.channel.send("> :x: You don't have permissions to use this command.");
		}
	}
}
			


			

