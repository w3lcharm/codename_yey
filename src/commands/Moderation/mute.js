function parseTime(time) {
	if (!time) return;
	let timeNumber = parseInt(time.substr(0, time.length - 1)) * 1000;

	if (time.endsWith("s")) timeNumber *= 1;
	if (time.endsWith("m")) timeNumber *= 60;
	if (time.endsWith("h")) timeNumber *= 3600;
	if (time.endsWith("d")) timeNumber *= 86400;

	return timeNumber;
}

module.exports = {
	name: "mute",
	group: "Moderation",
	description: "Mutes the provided user.\nAllowed time settings: `Ns`, `Nm`, `Nh`, `Nd` where N is a number.\nThis commamd requires \"Kick members\" permission.",
	usage: "<user> [time] [reason]",
	requiredPermissions: "kickMembers",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.createMessage(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		let [ userID, time, ...reason ] = args;
		const member = msg.channel.guild.members.get(msg.mentions[0].id || userID);
		if (!member) return;

		const parsedTime = parseTime(time);
		
		if (!parsedTime) reason.unshift(time);
		
		try {
			if (member.id === msg.author.id)
				return msg.channel.createMessage("> :x: You can't mute yourself.");
			if (member.id === client.user.id)
				return msg.channel.createMessage("> :x: You can't mute a bot.");

			let mutedRole = msg.channel.guild.roles.find(r => r.name === "Muted");
			if (!mutedRole) {
				mutedRole = await msg.channel.guild.createRole({
					name: "Muted",
					mentionable: false,
				});
				
				for (const channel of msg.channel.guild.channels.values()) {
					try {
						await channel.editPermission(mutedRole.id, 0, 6144, "role");
					} catch {}
				}
			}
			
			if (member.roles.includes(mutedRole.id))
				return msg.channel.createMessage("> :x: This user is already muted.");

			await member.addRole(mutedRole.id, `muted by ${msg.author.username}#${msg.author.discriminator}`);

			const embed = {
				author: {
					name: `${member.username}#${member.discriminator} has been muted`,
					icon_url: member.avatarURL,
				},
				color: 3066993,
				timestamp: new Date().toISOString(),
				fields: [
					{
						name: "Reason:",
						value: reason.join(" ") || "none",
					},
				],
				footer: { text: `You can unmute the user by typing ${prefix}unmute <user>.` },
			};

			await msg.channel.createMessage({ embed });
			if (parsedTime) setTimeout(() => member.removeRole(mutedRole.id, "unmute"), parsedTime);
		} catch (err) {
			let description;
			if (!msg.channel.guild.members.get(client.user.id).permission.has("manageRoles"))
				description = "I don't have the \"Manage roles\" permission to do this.";
			else if (member.id === msg.channel.guild.ownerID)
				description = "This user is a server owner.";
			else description = "This user's role is higher than my role.";

			const embed = {
				title: ":x: Mute failed.",
				description,
				color: 15158332,
			};
			await msg.channel.createMessage({ embed });
		}
	}	
};
