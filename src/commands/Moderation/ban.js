module.exports = {
	name: "ban",
	group: "Moderation",
	description: "Bans the specified member.\nThis command requires \"Ban members\" permission.",
	requiredPermissions: "banMembers",
	guildOnly: true,
	usage: "<user> [reason]",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.createMessage(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		const userID = args.shift();
		const reason = args.join(" ");

		const member = msg.channel.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") || msg.channel.guild.members.get(userID);

		if (!member) return;

		try {
			if (member.id === msg.author.id)
				return msg.channel.createMessage("> :x: You can't ban yourself.");
			if (member.id === client.user.id)
				return msg.channel.createMessage("> :x: You can't ban a bot.");

			await member.ban(0, reason);

			const embed = {
				author: {
					name: `${member.username}#${member.discriminator} has been banned`,
					icon_url: member.avatarURL,
				},
				title: "Reason:",
				description: reason || "none",
				color: 3066993,
				timestamp: new Date().toISOString(),
			};
				
			await msg.channel.createMessage({ embed: embed });
		} catch (err) {
			let description;
			if (!msg.channel.guild.members.get(client.user.id).permission.has("banMembers"))
				description = "I don't have the \"Ban members\" permission to do this.";
			else if (member.id === msg.channel.guild.ownerID)
				description = "Provided user is a server owner."
			else if (member.highestRole.position >= msg.channel.guild.members.get(client.user.id).highestRole.position)
				description = "This user's role is higher than my role.";
			else {
				description = "Something went wrong. Try again later.";
				client.emit("commandError", this.name, msg, err, false);
			}

			const embed = {
				title: ":x: Ban failed.",
				description: description,
				color: 15158332,
			};
			await msg.channel.createMessage({ embed: embed });
		}
	}
};
