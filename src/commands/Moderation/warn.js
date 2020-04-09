const PermissionError = require("../../errors/permissionError");

module.exports = {
	name: "warn",
	group: "Moderation",
	description: "Warns the specified user. Requires \"Kick members\" permission.",
	guildOnly: true,
	usage: "[-d | --delete <id>] [-l | --list <user>] <user> [reason]",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.createMessage(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		if (args[0] == "--list" || args[0] == "-l") {
			let member;
			if (!args[1]) member = msg.member;
			else member = msg.channel.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") || msg.channel.guild.members.get(args[1]);
			let embed = {
				author: {
					name: `${member.username}#${member.discriminator}`,
					icon_url: member.avatarURL,
				},
				color: Math.round(Math.random() * 16777216) + 1,
				fields: [],
			};
				
			const warnList = await warns.findAll({
				where: {
					server: msg.channel.guild.id,
					user: member.user.id,
				},
			});
			for (let warn of warnList)
				embed.fields.push({
					name: `ID: ${warn.id}`,
					value: `Reason: ${warn.reason || "none"}`,
				});
			embed.footer = { text: `Total warns: ${warnList.length}` };
			await msg.channel.createMessage({ embed: embed });
			return;
		}

		if (msg.member.permission.has("kickMembers")) {
			if (args[0] == "--delete" || args[0] == "-d") {
				let id = args[1];
				const warn = await warns.findOne({
					where: {
						server: msg.channel.guild.id,
						id: id,
					},
				});
				if (!warn) msg.channel.createMessage("> :x: Invalid ID.");
				else if (warn.server != msg.channel.guild.id)
					msg.channel.createMessage("> :x: This warn is located on the another server.");
				else {
					await warns.destroy({ where: { id: id } });
					msg.channel.createMessage(`> :white_check_mark: Deleted a warn with ID ${warn.id}.`);
				}
				return;
					
			}
			const userID = args.shift();
			const reason = args.join(" ");
			const member = msg.channel.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") || msg.channel.guild.members.get(userID);

			if (!member) return;
			if (member.id == msg.author.id)
				return msg.channel.createMessage("> :x: You can't warn yourself.");
			if (member.id == client.user.id)
				return msg.channel.createMessage("> :x: You can't warn a bot.");
			if (member.permission.has("administrator"))
				return msg.channel.createMessage("> :x: You can't warn the administrator.");

			const warnObj = await warns.create({
				server: msg.channel.guild.id,
				user: member.id,
				warnedBy: msg.author.id,
				reason: reason,
			});

			const embed = {
				author: {
					name: `${member.username}#${member.discriminator} has been warned`,
					icon_url: member.avatarURL,
				},
				title: "Reason:",
				description: reason,
				color: 3066993,
				timestamp: new Date().toISOString(),
				footer: { text: `Warn ID: ${warnObj.id}` },
			};
			await msg.channel.createMessage({ embed: embed });
		} else
			throw new PermissionError("missing permission", "kickMembers");
	}
};
