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
			else member = msg.mentions.members.first() || msg.guild.member(client.users.find(u => u.id == args[1] || u.tag == args[1]));
			let embed = new Discord.RichEmbed()
				.setColor("RANDOM")
				.setAuthor(member.user.tag, member.user.avatarURL || member.user.defaultAvatarURL);
			client.db.all("select * from warns where user = ? and server = ?", member.user.id, msg.guild.id, async (err, rows) => {
				for (let row of rows)
					embed.addField(`ID: ${row.id}`, `Reason: ${row.reason}`);
				embed.setFooter(`Total warns: ${rows.length}`)
				await msg.channel.send(embed);
			});
			return;
		}

		if (msg.member.hasPermission("KICK_MEMBERS")) {
			if (args[0] == "--delete") {
				let id = args[1];
				client.db.get("select * from warns where id = ?", parseInt(id), function (err, row) {
					if (!row) msg.channel.send("> :x: Invalid ID.");
					else if (row.server != msg.guild.id) msg.channel.send("> :x: This warn is located on the another server.");
					else {
						client.db.run("delete from warns where id = ?", row.id);
						msg.channel.send(`> :white_check_mark: Deleted warn with ID ${row.id}`);
					}
				});
				return;
					
			}
			const userID = args.shift();
			const reason = args.join(" ");
			const member = msg.mentions.members.first() || msg.guild.member(client.users.find(u => u.id == userID || u.tag == userID));
			if (!member) return;
			if (member.user.id == msg.author.id)
				return msg.channel.send("> :x: You can't warn yourself.");
			if (member.user.id == client.user.id)
				return msg.channel.send("> :x: You can't warn a bot.");
			if (member.hasPermission("ADMINISTRATOR"))
				return msg.channel.send("> :x: You can't warn the administrator.");

			await client.db.run(`insert into warns values (NULL, ?, ?, ?, ?)`, msg.guild.id, member.user.id, msg.author.id, reason);

			const embed = new Discord.RichEmbed()
				.setAuthor(`${member.user.tag} was warned`, member.user.displayAvatarURL)
				.setTimestamp()
				.setColor("GREEN")
				.addField("Reason:", reason || "not provided");
			await msg.channel.send(embed);
		} else
			return msg.reply("you must have the permission to do this.");
	}
};
