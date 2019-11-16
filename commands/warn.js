const Discord = require("discord.js");

module.exports = {
	name: "warn",
	description: "Выдает варн указанному пользователю.\nВам нужно иметь разрешение \"Кикать участников\" для использования этой команды.",
	guildOnly: true,
	usage: "[--delete <id>] [--list <пользователь>] <пользователь> [причина]",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`Использование: \`${prefix}${this.name} ${this.usage}\``);

		if (args[0] == "--list") {
			let member;
			if (!args[1]) member = msg.member;
			else member = msg.mentions.members.first() || msg.guild.member(client.users.get(args[1]));
			let embed = new Discord.RichEmbed()
				.setColor("RANDOM")
				.setAuthor(member.user.tag, member.user.avatarURL || member.user.defaultAvatarURL);
			client.db.all("select * from warns where user = ? and server = ?", member.user.id, msg.guild.id, async (err, rows) => {
				for (let row of rows)
					embed.addField(`ID: ${row.id}`, `Причина: ${row.reason}`);
				embed.setFooter(`Всего варнов: ${rows.length}`)
				await msg.channel.send(embed);
			});
			return;
		}

		if (msg.member.hasPermission("KICK_MEMBERS")) {
			if (args[0] == "--delete") {
				let id = args[1];
				client.db.get("select * from warns where id = ?", parseInt(id), function (err, row) {
					if (!row) msg.channel.send(":x: Неправильный ID.");
					else if (row.server != msg.guild.id) msg.channel.send(":x: Этот варн находится на другом сервере.");
					else {
						client.db.run("delete from warns where id = ?", row.id);
						msg.channel.send(`:white_check_mark: Успешно удален варн с ID ${row.id}`);
					}
				});
				return;
					
			}
			const userID = args.shift();
			const reason = args.join(" ");
			const member = msg.mentions.members.first() || msg.guild.member(client.users.get(userID));
			if (!member) return;
			if (member.user.id == msg.author.id)
				return msg.channel.send(":x: Вы не можете выдавать варн самому себе.");
			if (member.hasPermission("ADMINISTRATOR"))
				return msg.channel.send(":x: Вы не можете выдавать варны администраторам.");

			await client.db.run(`insert into warns values (NULL, ?, ?, ?, ?)`, msg.guild.id, member.user.id, msg.author.id, reason);

			const embed = new Discord.RichEmbed()
				.setAuthor(`Выдан варн пользователю ${member.user.tag}`, member.user.avatarURL || member.user.defaultAvatarURL)
				.setTimestamp()
				.setColor("GREEN")
				.addField("Причина:", reason || "отсутствует");
			await msg.channel.send(embed);
		} else
			return msg.reply("вы должны иметь разрешения на использование этой команды.");
	}
};
