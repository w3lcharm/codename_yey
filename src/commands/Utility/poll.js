module.exports = {
	name: "poll",
	group: "Utility",
	description: "Creates a reaction poll (up to 10 answers).",
	usage: "<question> <answers>",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.createMessage(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		const [ question, ...answers ] = args;
		const reactions = [ "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯" ];

		if (!answers.length)
			return msg.channel.createMessage("> :warning: There must be at least one answer in the poll.");

		if (answers.length > 10)
			return msg.channel.createMessage("> :x: Not more than 10 answers in the poll.");

		const embed = {
			title: question,
			description: answers.map((a, i) => `${reactions[i]} - ${a}`).join("\n"),
			color: Math.round(Math.random() * 16777216) + 1,
			footer: {
				text: `Started by ${msg.author.username}#${msg.author.discriminator}`,
				icon_url: msg.author.avatarURL,
			},
		};

		const message = await msg.channel.createMessage({ embed: embed });

		for (let i = 0; i < answers.length; i++)
			await message.addReaction(reactions[i]);
	}
};
