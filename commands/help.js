const Discord = require("discord.js");

module.exports = {
	name: "help",
	description: "Shows the information about bot's commands.",
	usage: "[command]",
	async run(client, msg, args, prefix) {
		let embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setFooter("codename_yey", client.user.displayAvatarURL());
		
		const command = args[0];

		if (command) {
			if (!client.commands.has(command))
				return msg.reply("this command doesn't exist.");

			const commandObject = client.commands.get(command);
			if (commandObject.hidden)
				return msg.reply("this command doesn't exist.");

			embed.setTitle(`Help for command \`${command}\`:`);
			embed.setDescription(commandObject.description);

			let usage = `${prefix}${command}`;
			if (commandObject.usage)
				usage += ` ${commandObject.usage}`;

			embed.addField("Usage:", "```\n" + usage + "\n```");
			await msg.channel.send(embed);
		} else {
			embed.setTitle("Bot commands")
				.addField("Basic:", "`help`, `ping`, `avatar`, `user`, `links`, `serverinfo`, `status`")
				.addField("Utility:", "`say`, `qr`, `poll`")
				.addField("Moderation:", "`ban`, `kick`, `warn`, `purge`, `hackban`")
				.addField("Music", "`play`, `pause`, `resume`, `queue`, `skip`, `stop`")
				.addField("Other:", "`8ball`, `settings`");
			
			await msg.channel.send(embed);
		}
	}
};
