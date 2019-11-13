const Discord = require("discord.js");

module.exports = {
	name: "poll",
	description: "Создает опрос.",
	usage: "<вопрос> <ответ1> [ответ2] [ответ3]",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`Использование: \`${prefix}${this.name} ${this.usage}\``);

		const [ question, answer1, answer2, answer3 ] = args;

		if (!answer1 && !answer2)
			return msg.channel.send("В опросе должен быть хотя бы один ответ.");

		let embed = new Discord.RichEmbed()
			.setTitle(question)
			.setColor("RANDOM")
			.setTimestamp();

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
		embed.setDescription(description);

		let message = await msg.channel.send(embed);

		for (let reaction of reactionArray)
			await message.react(reaction);
	}
};
			
