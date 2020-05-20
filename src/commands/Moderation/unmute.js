module.exports = {
	name: "unmute",
	group: "moderationGroup",
	description: "unmuteDescription",
	usage: "unmuteUsage",
	requiredPermissions: "kickMembers",
	async run(client, msg, args, prefix, lang) {
		if (!args.length)
			return msg.channel.createMessage(lang.commandUsage(prefix, this));

		const userID = args[0];
		const member = msg.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") ||
			msg.guild.members.find(m => m.id == userID || m.tag == userID);

		if (!member) return;

		try {
			let mutedRole = msg.guild.roles.find(r => r.name === "Muted");
			if (!mutedRole) {
				mutedRole = await msg.guild.createRole({
					name: "Muted",
					mentionable: false,
				});

				for (const channel of msg.guild.channels.values()) {
					try {
						await channel.editPermission(mutedRole.id, 0, 6144, "role");
					} catch {}
				}
			}

			if (!member.roles.includes(mutedRole.id))
				return msg.channel.createMessage(lang.userNotMuted);

			await member.removeRole(mutedRole.id, "unmute");

			const embed = {
				author: {
					name: lang.unmuteSuccess(member),
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
                        if (!msg.guild.members.get(client.user.id).permission.has("manageRoles"))
				description = lang.botDontHavePerms("Manage roles");
			else if (member.id === msg.guild.ownerID)
				description = lang.userIsOwner;
			else if (member.highestRole.position >= msg.guild.members.get(client.user.id).highestRole.position)
				description = lang.roleHigher;
			else {
				description = lang.somethingWentWrong;
				client.emit("commandError", this.name, msg, err, false);
			}

			const embed = {
				title: lang.unmuteFail,
				description,
				color: 15158332,
			};
			await msg.channel.createMessage({ embed });
		}
	}
};
