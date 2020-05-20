const Eris = require("eris");

module.exports = {
	name: "eval",
	group: "devGroup",
	description: "evalDescription",
	hidden: true,
	ownerOnly: true,
	usage: "evalUsage",
	async run(client, msg, args, prefix) {
		const code = msg.content.slice(prefix.length + this.name.length + 1);
		const asyncifiedCode = `(async () => {\n${code}\n})()`;

		try {
			let evaled = await eval(asyncifiedCode);
			
			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled);

			await msg.channel.createMessage(`\`\`\`js\n${evaled}\n\`\`\``);
		} catch (err) {
			await msg.channel.createMessage(`\`\`\`js\n${err}\n\`\`\``);
		}
	}
};
