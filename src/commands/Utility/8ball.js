const magicball = require("../../utils/8ball");

module.exports = {
	name: "8ball",
	group: "Utility",
	description: "A magic 8 ball.",
	usage: "<question>",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.createMessage(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		const question = msg.content.slice(prefix.length + this.name.length + 1);

		const embed = {
			title: ":8ball: The magic ball's answer is:",
			description: magicball.predict(question, 0.25, msg.author.id),
			color: 9807270,
			fields: [
				{
					name: "Your question",
					value: question,
				},
			],
		};

		await msg.channel.createMessage({ embed: embed });
	}
};
