const Discord = require("discord.js");

module.exports = {
	name: "eval",
	description: "Evaluates the JavaScript code.\nThis command can only be used by the bot owner.",
	usage: "<code>",
	ownerOnly: true,
	hidden: true,
	async run(client, msg, args, prefix) {
		const code = msg.content.slice(prefix.length + this.name.length + 1);

		try {
			const asyncifiedCode = `(async () => {\n${code}\n})()`;

			let evaled = await eval(asyncifiedCode);

			if (typeof evaled != "string")
				evaled = require("util").inspect(evaled);

			await msg.channel.send(evaled, { code: "js" });
		} catch (err) {
			await msg.channel.send(err.stack, { code: "js"});
		}
	}
};
