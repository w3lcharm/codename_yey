const Discord = require("discord.js");

module.exports = {
	name: "warn",
	description: "Warns the mentioned user.\nYou must have the \"Kick members\" mention to use this command.",
	guildOnly: true,
	usage: "[--delete <id>] [--list <user>] <user> [reason]",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		if (args[0] == "--list") {
			let member;
			if (!args[1]) member = msg.member;
			else member = msg.mentions.members.first() || msg.guild.member(client.users.cache.find(u => u.id == args[1] || u.tag == args[1]));
			let embed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setAuthor(member.user.tag, member.user.displayAvatarURL());
				
			const warnList = await warns.findAll({
				where: {
					server: msg.guild.id,
					user: member.user.id,
				},
			});
			for (let warn of warnList)
				embed.addField(`ID: ${warn.id}`, `Reason: ${warn.reason}`);
			embed.setFooter(`Total warns: ${warnList.length}`);
			await msg.channel.send(embed);
			return;
		}

		if (msg.member.hasPermission("KICK_MEMBERS")) {
			if (args[0] == "--delete") {
				let id = args[1];
				const warn = await warns.findOne({
					where: {
						server: msg.guild.id,
						id: id,
					},
				});
				if (!warn) msg.channel.send("> :x: Invalid ID.");
				else if (warn.server != msg.guild.id)
					msg.channel.send("> :x: This warn is located on the another server.");
				else {
					await warns.destroy({ where: { id: id } });
					msg.channel.send(`> :white_check_mark: Deleted warn with ID ${warn.id}`);
				}
				return;
					
			}
			const userID = args.shift();
			const reason = args.join(" ");
			const member = msg.mentions.members.first() || msg.guild.member(client.users.cache.find(u => u.id == userID || u.tag == userID));
			if (!member) return;
			if (member.user.id == msg.author.id)
				return msg.channel.send("> :x: You can't warn yourself.");
			if (member.user.id == client.user.id)
				return msg.channel.send("> :x: You can't warn a bot.");
			if (member.hasPermission("ADMINISTRATOR"))
				return msg.channel.send("> :x: You can't warn the administrator.");

			await warns.create({
				server: msg.guild.id,
				user: member.user.id,
				warnedBy: msg.author.id,
				reason: reason,
			});

			const embed = new Discord.MessageEmbed()
				.setAuthor(`${member.user.tag} was warned`, member.user.displayAvatarURL())
				.setTimestamp()
				.setColor("GREEN")
				.addField("Reason:", reason || "not provided");
			await msg.channel.send(embed);
		} else
			await msg.channel.send("> :x: You don't have the permissions to use this command.");
	}
};
