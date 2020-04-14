module.exports = {
	name: "kick",
	group: "Moderation",
	description: "Kicks the specified member.\nThis command requires \"Kick members\" permission.",
	requiredPermissions: "kickMembers",
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
				return msg.channel.createMessage("> :x: You can't kick yourself.");
			if (member.id === client.user.id)
				return msg.channel.createMessage("> :x: You can't kick a bot.");
			
			await member.kick(reason);

			const embed = {
				author: {
					name: `${member.username}#${member.discriminator} has been kicked`,
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
			if (!msg.channel.guild.members.get(client.user.id).permission.has("kickMembers"))
				description = "I don't have the \"Kick members\" permission to do this.";
			else if (member.id === msg.channel.guild.ownerID)
				description = "Provided user is a server owner."
			else description = "Provided user's role is higher than my role.";

			const embed = {
				title: ":x: Kick failed.",
				description: description,
				color: 15158332,
			};
			await msg.channel.createMessage({ embed: embed });
		}
	}
};
