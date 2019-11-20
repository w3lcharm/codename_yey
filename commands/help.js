const Discord = require("discord.js");

module.exports = {
	name: "help",
	description: "Shows the information about bot's commands.",
	usage: "[command]",
	async run(client, msg, args, prefix) {
		let embed = new Discord.RichEmbed()
			.setColor("RANDOM")
			.setFooter("codename_yey", client.user.avatarURL || client.user.defaultAvatarURL);
		
		const command = args[0];

		if (command) {
			if (!client.commands.has(command))
				return msg.reply("this command doesn't exists.");

			const commandObject = client.commands.get(command);
			if (commandObject.hidden)
				return msg.reply("this command doesn't exists.");

			embed.setTitle(`Help for command \`${command}\`:`);
			embed.setDescription(commandObject.description);

			let usage = `${prefix}${command}`;
			if (commandObject.usage)
				usage += ` ${commandObject.usage}`;

			embed.addField("Usage:", "```\n" + usage + "\n```");
			await msg.channel.send(embed);
		} else {
			let description = [];
			for (let c of Array.from(client.commands)) {
				if (!c[1].hidden)
					description.push(`${c[1].name}`);
			}

			embed.setTitle("Bot commands");
			embed.setDescription(`You can type ${prefix}help [command] to get more info about a command.\n\`\`\`\n${description.join("\n")}\n\`\`\``);
			
			await msg.channel.send(embed);
		}
	}
};
