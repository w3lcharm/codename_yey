const Discord = require("discord.js");
const magicball = require("../modules/8ball");

module.exports = {
	name: "8ball",
	description: "The magic 8 ball",
	usage: "<question>",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`> Usage: \`${prefix}${this.name} ${this.usage}\``);
		const question = args.join(" ");
		const answer = magicball.predict(question, 0.25, msg.author.id);

		const embed = new Discord.RichEmbed()
			.setTitle(":8ball: The magic ball's answer is:")
			.setDescription(answer)
			.addField("Your question:", question)
			.setColor("GREY");
		await msg.channel.send(embed);
	}
};
