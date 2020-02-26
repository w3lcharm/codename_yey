module.exports = {
	name: "purge",
	group: "Moderation",
	description: "Deleted the specified amount of messages in this channel.\nRequires \"Manage messages\" permission",
	guildOnly: true,
	requiredPermissions: "manageMessages",
	usage: "[amount]",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.createMessage(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		const amount = parseInt(args[0]);

		if (isNaN(amount))
			return msg.channel.createMessage(`> :x: Amount value must be an integer.`);

		if (amount < 1)
			return msg.channel.createMessage(`> :x: Not less than 1 message per time.`);
		if (amount > 100)
			return msg.channel.createMessage(`> :x: Not more than 100 messages per time.`);

		await msg.channel.purge(amount + 1);

		const embed = {
			title: `:white_check_mark: Successfully deleted ${amount} messages.`,
			description: "This message will be automatically deleted in 5 seconds.",
			timestamp: new Date().toISOString(),
			color: 3066993,
		};

		const message = await msg.channel.createMessage({ embed: embed });
		setTimeout(() => message.delete(), 5000);
	}
};
