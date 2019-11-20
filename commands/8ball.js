const Discord = require("discord.js");

const answers = [
	"It is certain",
	"Without a doubt",
	"Yes",
	"Yes — definitely",
	"It is decidedly so",
	"You may rely on it",
	"As I see it, yes",
	"Most likely",
	"Outlook good",
	"Signs point to yes",
	"Reply hazy, try again",
	"Ask again later",
	"Better not tell you now",
	"Cannot predict now",
	"Concentrate and ask again",
	"Don’t count on it",
	"No",
	"Outlook not so good",
	"Very doubtful",
	"My sources say no"
];

module.exports = {
	name: "8ball",
	description: "The magic 8 ball",
	usage: "<question>",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`Usage: \`${prefix}${this.name} ${this.usage}\``);
		const question = args.join(" ");
		const answer = answers[Math.floor(Math.random() * Math.floor(answers.length))];

		const embed = new Discord.RichEmbed()
			.setTitle(":8ball: The magic ball's answer is:")
			.setDescription(answer)
			.addField("Your question:", question)
			.setColor("GREY");
		await msg.channel.send(embed);
	}
};
