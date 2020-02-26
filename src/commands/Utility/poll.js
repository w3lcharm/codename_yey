module.exports = {
	name: "poll",
	group: "Utility",
	description: "Creates a reaction poll.",
	usage: "<question> <answer1> [answer2] [answer3]",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.createMessage(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		const [ question, answer1, answer2, answer3 ] = args;

		if (!answer1 && !answer2)
			return msg.channel.createMessage("> :warning: There must be at least one answer in the poll.");

		const embed = {
			title: question,
			color: Math.round(Math.random() * 16777216) + 1,
			footer: {
				text: `Started by ${msg.author.username}#${msg.author.discriminator}`,
				icon_url: msg.author.avatarURL,
			},
		};

		let description = `🇦 - ${answer1}`;
		let reactionArray = [ "🇦" ];
		if (answer2) {
			description += `\n🇧 - ${answer2}`;
			reactionArray.push("🇧");
		}
		if (answer3) {
			description += `\n🇨 - ${answer3}`;
			reactionArray.push("🇨");
		}
		embed.description = description;

                const message = await msg.channel.createMessage({ embed: embed });

                for (let reaction of reactionArray)
                        await message.addReaction(reaction);
	}
};
