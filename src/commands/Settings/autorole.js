module.exports = {
	name: "autorole",
	group: "Settings",
	description: "This command allows you to manage the autorole setting.\nRequires \"Manage server\" permission.",
	requiredPermissions: "manageGuild",
	usage: "[role: id, name, mention or \"disable\" to disable]",
	guildOnly: true,
	async run(client, msg, args, prefix) {
		let roleID = args[0];
		if (roleID && roleID.startsWith("<@&"))
			roleID = roleID.replace("<@&", "").replace("<@&", "");

		if (!roleID) {
			const dbItem = await autorole.findOne({ where: { server: msg.channel.guild.id } });
			let role;
			if (dbItem) role = msg.channel.guild.roles.get(dbItem.autorole);

			const embed = {
				title: "Autorole",
				description: role ? `Autorole is enabled for role **${role.name}**.` : "Autorole is disabled.",
				color: Math.round(Math.random() * 16777216) + 1,
				footer: {
					text: `Type ${prefix}autorole [role] if you want to enable or change the autorole, else ${prefix}autorole disable.`,
				},
			};

			await msg.channel.createMessage({ embed: embed });
		} else {
			await autorole.findOrCreate({ where: { server: msg.channel.guild.id } });
			if (roleID == "disable") {
				await autorole.update({ autorole: null }, { where: { server: msg.channel.guild.id } });
				await msg.channel.createMessage("> :white_check_mark: Successfully set autorole to **\"disabled\"**.");
			} else {
				const role = msg.channel.guild.roles.find(r => r.id == roleID || r.name == roleID);
				if (!role) return msg.channel.createMessage("> :x: Invalid role name or ID provided.");

				await autorole.update({ autorole: role.id }, { where: { server: msg.channel.guild.id } });
				await msg.channel.createMessage(`> :white_check_mark: Successfully set autorole to **\"${role.name}\"**.`);
			}
		}
	}
}
