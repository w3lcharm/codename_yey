module.exports = {
	name: "avatar",
	group: "Basic",
	description: "Gets your or someone's avatar.",
	usage: "[user: id or mention]",
	guildOnly: true,
	async run(client, msg, args, prefix) {
		let userID = args[0];
		let user;

		if (!userID) user = msg.author;
		else user = client.users.get(msg.mentions.length ? msg.mentions[0].id : "") || client.users.get(userID);

		if (!user) return;
		
		let format;
		if (user.avatar)
			format = user.avatar.startsWith("a_") ? "gif" : "webp";

		const embed = {
			title: `${user.username}#${user.discriminator}'s avatar:`,
			url: user.dynamicAvatarURL(format, 2048),
			color: Math.round(Math.random() * 16777216) + 1,
			image: { url: user.dynamicAvatarURL(format, 2048) },
		};

		await msg.channel.createMessage({ embed: embed });
	}
};
