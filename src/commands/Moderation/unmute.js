module.exports = {
	name: "unmute",
	group: "Moderation",
	description: "Unmutes the provided user.\n This command requires \"Kick members\" permission.",
	usage: "<user>",
	requiredPermissions: "kickMembers",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.createMessage(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		const userID = args[0];
		const member = msg.channel.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") ||
			msg.channel.guild.members.get(userID);

		if (!member) return;

		try {
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

			if (!member.roles.includes(mutedRole.id))
				return msg.channel.createMessage("> :x: This user is not muted.");

			await member.removeRole(mutedRole.id, "unmute");

			const embed = {
				author: {
					name: `${member.username}#${member.discriminator} has been unmuted`,
					icon_url: member.avatarURL,
				},
				color: 3066993,
				timestamp: new Date().toISOString(),
			};

			await msg.channel.createMessage({ embed });
			clearTimeout(muteTimers.get(member.id));
			muteTimers.delete(member.id);
		} catch (err) {
			let description;
                        if (!msg.channel.guild.members.get(client.user.id).permission.has("manageRoles"))
				description = "I don't have the \"Manage roles\" permission to do this.";
			else if (member.id === msg.channel.guild.ownerID)
				description = "This user is a server owner.";
			else if (member.highestRole.position >= msg.channel.guild.members.get(client.user.id).highestRole.position)
				description = "This user's role is higher than my role.";
			else {
				description = "Something went wrong. Try again later.";
				client.emit("commandError", this.name, msg, err, false);
			}

			const embed = {
				title: ":x: Unmute failed.",
				description,
				color: 15158332,
			};
			await msg.channel.createMessage({ embed });
		}
	}
};
