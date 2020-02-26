module.exports = {
	name: "help",
	group: "Basic",
	description: "Shows information about bot commands.",
	usage: "[command]",
	async run(client, msg, args, prefix) {
		const commandName = args[0];
		let embed;
		
		if (commandName) {
			const command = client.commands.get(commandName);
			if (!command || command.hidden) {
				embed = {
					title: `:x: Command **${commandName}** does not exist.`,
					description: `Type \`${prefix}help\` for list of all commands.`,
					color: 15158332,
					footer: {
						text: "codename_yey",
						icon_url: client.user.avatarURL,
					},
				};
				return msg.channel.createMessage({ embed: embed });
			}

			let usage = `${prefix}${command.name}`;
			if (command.usage) usage += ` ${command.usage}`;

			embed = {
				title: `Help for command \`${command.name}\`:`,
				description: command.description,
				color: Math.round(Math.random() * 16777216) + 1,
				fields: [
					{
						name: "Usage:",
						value: `\`\`\`\n${usage}\n\`\`\``,
					},
				],
				footer: {
					title: "codename_yey",
					icon_url: client.user.avatarURL,
				},
			};

			await msg.channel.createMessage({ embed: embed });
		} else {
			let fields = [];
			for (let group of Array.from(client.groups.values())) {
				const commandNames = group.commands.filter(c => !c.hidden).map(cmd => `\`${cmd.name}\``);
				if (!commandNames.length) continue;

				fields.push({
					name: group.name,
					value: commandNames.join(", "),
				});
			}
			
			embed = {
				title: "Bot commands",
				color: Math.round(Math.random() * 16777216) + 1,
				fields: fields,
				footer: {
					text: "codename_yey",
					icon_url: client.user.avatarURL,
				},
			};

			await msg.channel.createMessage({ embed: embed });
		}
	}
};
