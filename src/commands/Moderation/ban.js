module.exports = {
	name: "ban",
	group: "moderationGroup",
	description: "banDescription",
	requiredPermissions: "banMembers",
	guildOnly: true,
	usage: "banUsage",
	async run(client, msg, args, prefix, lang) {
		if (!args.length)
			return msg.channel.createMessage(lang.commandUsage(prefix, this));

		const userID = args.shift();
		const reason = args.join(" ");

		const member = msg.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") || msg.guild.members.find(m => m.id === userID || m.tag === userID);

		if (!member) return;

		try {
			if (member.id === msg.author.id)
				return msg.channel.createMessage(lang.cantBanYourself);
			if (member.id === client.user.id)
				return msg.channel.createMessage(lang.cantBanBot);

			await member.ban(0, `${reason} (banned by ${msg.author.username}#${msg.author.discriminator})`);

			const embed = {
				author: {
					name: lang.banSuccess(member),
					icon_url: member.avatarURL,
				},
				description: lang.reason(reason),
				color: 3066993,
				timestamp: new Date().toISOString(),
			};
				
			await msg.channel.createMessage({ embed });
		} catch (err) {
			let description;
			if (!msg.channel.guild.members.get(client.user.id).permission.has("banMembers"))
				description = lang.botDontHavePerms("Ban members");
			else if (member.id === msg.channel.guild.ownerID)
				description = lang.userIsOwner;
			else if (member.highestRole.position >= msg.channel.guild.members.get(client.user.id).highestRole.position)
				description = lang.roleIsHigher;
			else {
				description = lang.somethingWentWrong;
				client.emit("commandError", this.name, msg, err, false);
			}

			const embed = {
				title: lang.banFail,
				description,
				color: 15158332,
			};
			await msg.channel.createMessage({ embed });
		}
	}
};
