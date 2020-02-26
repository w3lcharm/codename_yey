module.exports = {
	name: "eval",
	group: "Dev",
	description: "Evaluates the JavaScript code.",
	hidden: true,
	ownerOnly: true,
	usage: "<code>",
	async run(client, msg, args, prefix) {
		const code = msg.content.slice(prefix.length + this.name.length + 1);
		const asyncifiedCode = `(async () => {\n${code}\n})()`;

		try {
			let evaled = await eval(asyncifiedCode);
			
			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled);

			await msg.channel.createMessage(`\`\`\`js\n${evaled}\n\`\`\``);
		} catch (err) {
			await msg.channel.createMessage(`\`\`\`js\n${err.stack}\n\`\`\``);
		}
	}
};
