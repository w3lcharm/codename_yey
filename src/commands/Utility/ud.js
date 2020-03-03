const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

module.exports = {
	name: "ud",
	group: "Utility",
	description: "Searches the word definition in Urban Dictionary.",
	usage: "<word>",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.createMessage(`> Usage: \`${prefix}${this.name} ${this.length}\``);

		const word = msg.content.slice(prefix.length + this.name.length + 1);

		const params = new URLSearchParams();
		params.append("term", word);

		const resp = await fetch(`http://api.urbandictionary.com/v0/define?${params}`);
		const data = (await resp.json()).list[0];

		if (!data)
			return msg.channel.createMessage(`> :x: Word not found.`);

		const embed = {
			title: data.word,
			description: data.definition,
			url: data.permalink,
			color: Math.round(Math.random() * 16777216) + 1,
			fields: [
				{
					name: "Example:",
					value: data.example,
				},
			],
			footer: {
				text: `Author: ${data.author}`,
			},
		};
		await msg.channel.createMessage({ embed: embed });
	}
};
