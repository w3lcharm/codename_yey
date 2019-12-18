const Discord = require("discord.js");

module.exports = {
	name: "eval",
	description: "Evaluates the JavaScript code.\nThis command can only be used by the bot owner.",
	usage: "<code>",
	ownerOnly: true,
	hidden: true,
	async run(client, msg, args, prefix) {
		args = msg.content.slice(prefix.length).split(/ +/)
		args.shift();

		const code = args.join(" ");
		let evaled = eval(code);

		if (typeof evaled != "string")
			evaled = require("util").inspect(evaled);

		await msg.channel.send(evaled, { code: "js" })
	}
};
