module.exports = {
	name: "say",
	group: "utilityGroup",
	description: "sayDescription",
	usage: "sayUsage",
	async run(client, msg, args, prefix, lang) {
		if (!args.length)
			return msg.channel.createMessage(lang.commandUsage(prefix, this));

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
