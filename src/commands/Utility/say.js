module.exports = {
	name: "say",
	group: "Utility",
	description: "Says your text.",
	usage: "<text>",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.createMessage(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		const text = msg.content.slice(prefix.length + this.name.length + 1);

		const embed = {
			description: text,
			color: Math.round(Math.random() * 16777216) + 1,
			footer: {
				text: `${msg.author.username}#${msg.author.discriminator}`,
				icon_url: msg.author.avatarURL,
			},
		};

		await msg.channel.createMessage({ embed: embed });

		if (msg.channel.guild.members.get(client.user.id).permission.has("manageMessages"))
			await msg.delete();
	}
};
