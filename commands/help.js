const Discord = require("discord.js");

module.exports = {
	name: "help",
	description: "Показывает справку по командам бота или по одной команде.",
	async run(client, msg, args, prefix) {
		let embed = new Discord.RichEmbed()
			.setColor("RANDOM")
			.setFooter("codename_yey", client.user.avatarURL || client.user.defaultAvatarURL);
		
		const command = args[0];

		if (command) {
			if (!client.commands.has(command))
				return msg.reply("такой команды не существует.");

			const commandObject = client.commands.get(command);
			if (commandObject.hidden)
				return msg.reply("такой команды не существует.");

			embed.setTitle(`Справка по команде \`${command}\`:`);
			embed.setDescription(commandObject.description);

			let usage = `${prefix}${command}`;
			if (commandObject.usage)
				usage += ` ${commandObject.usage}`;

			embed.addField("Как использовать:", "```\n" + usage + "\n```");
			await msg.channel.send(embed);
		} else {
			let description = [];
			for (let c of Array.from(client.commands)) {
				if (!c[1].hidden)
					description.push(`${c[1].name}`);
			}

			embed.setTitle("Команды бота");
			embed.setDescription(`Вы можете написать ${prefix}help [команда], чтобы больше узнать о команде.\n\`\`\`\n${description.join("\n")}\n\`\`\``);
			
			await msg.channel.send(embed);
		}
	}
};
