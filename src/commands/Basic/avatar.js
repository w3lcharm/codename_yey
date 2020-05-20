module.exports = {
	name: "avatar",
	group: "basicGroup",
	description: "avatarDescription",
	usage: "avatarUsage",
	guildOnly: true,
	async run(client, msg, args, prefix, lang) {
		let userID = args[0];
		let user;

		if (!userID) user = msg.author;
		else user = msg.mentions[0] || client.users.find(u => u.tag === userID || u.id === userID);

		if (!user) return;
		
		let format;
		if (user.avatar)
			format = user.avatar.startsWith("a_") ? "gif" : "webp";

		const embed = {
			author: {
				name: lang.avatarUser(user),
				url: user.dynamicAvatarURL(format, 2048),
			},
			color: Math.round(Math.random() * 16777216) + 1,
			image: { url: user.dynamicAvatarURL(format, 2048) },
		};

		await msg.channel.createMessage({ embed: embed });
	}
};
