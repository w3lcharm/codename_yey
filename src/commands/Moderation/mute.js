global.muteTimers = new Map();

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
	group: "moderationGroup",
	description: "muteDescription",
	usage: "muteUsage",
	requiredPermissions: "kickMembers",
	async run(client, msg, args, prefix, lang) {
		if (!args.length)
			return msg.channel.createMessage(lang.commandUsage(prefix, this));

		let [ userID, time, ...reason ] = args;
		const member = msg.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") ||
			msg.guild.members.find(m => m.id === userID || m.tag === userID);
		if (!member) return;

		const parsedTime = parseTime(time);
		
		if (!parsedTime) reason.unshift(time);
		
		try {
			if (member.id === msg.author.id)
				return msg.channel.createMessage(lang.cantMuteYourself);
			if (member.id === client.user.id)
				return msg.channel.createMessage(lang.cantMuteBot);

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
			
			if (member.roles.includes(mutedRole.id))
				return msg.channel.createMessage(lang.userAlreadyMuted);

			await member.addRole(mutedRole.id, `muted by ${msg.author.username}#${msg.author.discriminator}`);

			const embed = {
				author: {
					name: lang.muteSuccess(member),
					icon_url: member.avatarURL,
				},
				description: lang.reason(reason.join(" ")),
				color: 3066993,
				timestamp: new Date().toISOString(),
				footer: { text: lang.canUnmuteSuggestion(prefix) },
			};

			await msg.channel.createMessage({ embed });
			if (parsedTime) {
				muteTimers.set(member.id, setTimeout(() => member.removeRole(mutedRole.id, "unmute"), parsedTime));
				setTimeout(() => {
					clearTimeout(muteTimers.get(member.id));
					muteTimers.delete(member.id);
				}, parsedTime);
			}
		} catch (err) {
			let description;
			if (!msg.guild.members.get(client.user.id).permission.has("manageRoles"))
				description = lang.botDontHavePerms("Manage roles")
			else if (member.id === msg.guild.ownerID)
				description = lang.userIsOwner;
			else if (member.highestRole.position >= msg.guild.members.get(client.user.id).highestRole.position)
				description = lang.roleHigher;
			else {
				description = lang.somethingWentWrong;
				client.emit("commandError", this.name, msg, err, false);
			}

			const embed = {
				title: lang.muteFail,
				description,
				color: 15158332,
			};
			await msg.channel.createMessage({ embed });
		}
	}	
};
