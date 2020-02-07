const Discord = require("discord.js");

module.exports = {
	name: "autorole",
	description: "This command allows you to manage the autorole setting.\nYou must have the \"Manage server\" permission to use this command.",
	usage: "[role: id, name, mention or \"disable\" to disable]",
	guildOnly: true,
	async run(client, msg, args, prefix) {
		if (msg.member.hasPermission("MANAGE_SERVER")) {
			let roleID = args[0];
			if (roleID && roleID.startsWith("<@&"))
				roleID = roleID.replace("<@&", "").replace("<@&", "");

			if (!roleID) {
				const dbItem = await settings.findOne({ where: { server: msg.guild.id } });
				let role;
				if (dbItem) role = msg.guild.roles.get(dbItem.autorole);

				const embed = new Discord.MessageEmbed()
					.setTitle("Autorole")
					.setDescription(role ? `Autorole is enabled for role **${role.name}**.` : "Autorole is disabled.")
					.setColor("RANDOM")
					.setFooter(`Type ${prefix}autorole [role] if you want to enable or change the autorole, else ${prefix}autorole disable.`);

				await msg.channel.send(embed);
			} else {
				await settings.findOrCreate({ where: { server: msg.guild.id } });
				if (roleID == "disable") {
					await settings.update({ autorole: null }, { where: { server: msg.guild.id } });
					await msg.channel.send("> :white_check_mark: Successfully set autorole to **\"disabled\"**.");
				} else {
					const role = msg.guild.roles.find(r => r.id == roleID || r.name == roleID);
					if (!role) return msg.channel.send("> :x: Invalid role name or ID provided.");

					await settings.update({ autorole: role.id }, { where: { server: msg.guild.id } });
					await msg.channel.send(`> :white_check_mark: Successfully set autorole to **\"${role.name}\"**.`);
				}
			}
		}
	}
}
