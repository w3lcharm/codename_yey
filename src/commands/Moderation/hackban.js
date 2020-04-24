module.exports = {
	name: "hackban",
	group: "Moderation",
	description: "Hackbans the provided user.\nThis command requires \"Ban members\" permission.",
	usage: "<userID> [reason]",
	requiredPermissions: "banMembers",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.createMessage(`> Usage: \`${prefix}${this.name} ${this.usage}\``);
		
		const userID = args.shift();
		const reason = args.join(" ");

		try {
			if (userID === msg.author.id)
				return msg.channel.createMessage("> :x: You can't ban yourself.");
			if (userID === client.user.id)
				return msg.channel.createMessage("> :x: You can't ban a bot.");
			
			await msg.channel.guild.banMember(userID, 0, reason);

			const embed = {
				title: `:white_check_mark: User with ID \`${userID}\` has been successfully hackbanned.`,
				color: 3066993,
				timestamp: new Date().toISOString(),
				fields: [
					{
						name: "Reason:",
						value: reason || "none",
					},
				],
			};
			await msg.channel.createMessage({ embed });
		} catch (err) {
			let description;
			if (!msg.channel.guild.members.get(client.user.id).permission.has("banMembers"))
				description = "I don't have the \"Ban members\" permission to do this.";
			else if (member.id === msg.channel.guild.ownerID)
				description = "Provided user is a server owner."
			else description = "Provided user's role is higher than my role.";

			const embed = {
				title: ":x: Hackban failed.",
				description: description,
				color: 15158332,
			};
			await msg.channel.createMessage({ embed: embed });
		}
	}
}
