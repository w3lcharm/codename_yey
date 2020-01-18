const Discord = require("discord.js");

module.exports = {
	name: "settings",
	description: "Shows or modifies the bot settings on this server.\nYou must have the \"Manage server\" permission to use this command.",
	usage: "[settingName] [value]",
	guildOnly: true,
	async run(client, msg, args, prefix) {
		var [ settingName, value ] = args;

		if (msg.member.hasPermission("MANAGE_GUILD")) {
			client.db.get("select * from settings where server = ?", msg.guild.id, async (err, row) => {
				let embed;
				if (!row) {
					client.db.run("insert into settings values (?, null)", msg.guild.id);
					return this.run(client, msg, args, prefix);
				}

				if (settingName == "autorole") {
					if (value) {
						if (value == "disable") {
							await client.db.run("update settings set autorole = null where server = ?", msg.guild.id);
							embed = new Discord.MessageEmbed()
								.setTitle("Settings: autorole")

								.setDescription(":white_check_mark: Autorole was successfully disabled.")
								.setColor("GREEN");
							return msg.channel.send(embed);
						}
						if (value.startsWith("<@&") && value.endsWith(">"))
							value = value.replace("<@&", "").replace(">", "");
						const role = msg.guild.roles.find(r => r.name == value || r.id == value);
						if (!role)
							return msg.channel.send(":x: Invalid role name or ID provided.");
						await client.db.run("update settings set autorole = ? where server = ?", role.id, msg.guild.id);
						embed = new Discord.MessageEmbed()
							.setTitle("Settings: autorole")
							.setDescription(`:white_check_mark: Autorole was successfully enabled for role \`${role.name}\`.`)
							.setColor("GREEN");
						await msg.channel.send(embed);
					} else {
						const role = msg.guild.roles.get(row.autorole);
						embed = new Discord.MessageEmbed()
							.setTitle("Settings: autorole")
							.setDescription(row.autorole ? `Autorole is enabled for role \`${role.name}\`.` : "Autorole is disabled.")
							.setFooter(`Type ${prefix}settings autorole [role: name or id] if you want to enable autorole, else type ${prefix}settings autorole disable.`)
							.setColor("RANDOM");
						await msg.channel.send(embed);
					}
				} else {
					const role = msg.guild.roles.get(row.autorole);
					embed = new Discord.MessageEmbed()
						.setTitle("Settings")
						.setDescription(`\`\`\`\nautorole: ${row.autorole ? `enabled for role ${role.name}` : "disabled"}\n\`\`\``)
						.setFooter(`Type ${prefix}settings [settingName] [value] if you want to change the settings.`)
						.setColor("RANDOM");
					await msg.channel.send(embed);
				}
			});
		} else {
			await msg.channel.send("> :x: You don't have permissions to use this command.");
		}
	}
}
