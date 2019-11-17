const Discord = require("discord.js");

module.exports = {
	name: "purge",
	description: "Удаляет указанное кол-во сообщений (от 1 до 100) в канале.\nВам нужно иметь разрешение \"Управлять сообщениями\" для использования этой команды.",
	guildOnly: true,
	usage: "<кол-во>",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`Использование: \`${prefix}${this.name} ${this.usage}\``);

		if (msg.member.hasPermission("MANAGE_MESSAGES")) {
			const amount = parseInt(args[0]);
			if (amount > 100)
				return msg.channel.send(":x: Не больше 100 сообщений за раз.")
			else if (amount < 1)
				return msg.channel.send(":x: Не меньше 1 сообщения.");
			else {
				if (msg.guild.me.hasPermission("MANAGE_MESSAGES")) {
					await msg.channel.bulkDelete(amount);
					let embed = new Discord.RichEmbed()
						.setTitle(`:white_check_mark: Успешно удалено ${amount} сообщений.`)
						.setColor("GREEN")
						.setTimestamp();
					let message = await msg.channel.send(embed);
					setTimeout(async () => await message.delete(), 5000);
				} else {
					let embed = new Discord.RichEmbed()
						.setTitle(":x: Я не смогу удалить сообщения в этом канале.")
						.setDescription("Пожалуйста, выдайте мне разрешение \"Управлять сообщениями\" и попробуйте еще раз.")
						.setColor("RED");
					await msg.channel.send(embed);
				}
			}
		} else
			return msg.reply("вы должны иметь разрешения на использование этой команды.");
	}
};
