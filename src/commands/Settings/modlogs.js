const { VoiceChannel } = require("eris");

module.exports = {
	name: "modlogs",
	group: "Settings",
	description: "Lets you to manage the modlogs channel.\nThis command requires \"Manage server\" permission.",
	usage: "[channel: mention or id]",
	requiredPermissions: "manageGuild",
	guildOnly: true,
	async run(client, msg, args, prefix) {
		let channel = args[0];
		const modlogChannel = await modlogs.findOrCreate({ where: { server: msg.guild.id } })
			.then(i => i[0].channel ? client.getChannel(i[0].channel) : undefined);

		if (!channel) {
			let description;
			if (modlogChannel) {
				description = `Modlogs are enabled in channel ${modlogChannel.mention}.`;
			} else {
				description = `Modlogs are disabled.`;
			}

			const embed = {
				title: "Modlogs",
				description,
				color: Math.round(Math.random() * 16777216) * 1,
				footer: {
					text: `Type ${prefix}modlogs ${this.usage} of you want to enable or change the modlogs channel, else type ${prefix}modlogs disable.`,
				},
			};

			return msg.channel.createMessage({ embed });
		} else {
			if (channel === "disable") {
				await modlogs.update(
					{ channel: null },
					{ where: { server: msg.guild.id } }
				);

				return msg.channel.createMessage("> :white_check_mark: Successfully set modlogs channel to **\"disabled\"**");
			} else {
				if (channel.startsWith("<#")) {
					channel = channel.replace("<#", "").replace(">", "");
				}
			
				const ch = client.getChannel(channel);
				if (!ch || ch instanceof VoiceChannel) {
					return msg.channel.createMessage("> :x: Invalid channel provided.");
				}
				if (!ch.memberHasPermission(msg.guild.me, "sendMessages") || !ch.memberHasPermission(msg.guild.me, "embedLinks")) {
					const embed = {
						title: ":x: I don't have the permissions to send messages to provided channel.",
						description: "Please give me `Send messages` and `Embed links` permissions in provided channel, then try again.",
						color: 3066993,
					};
					return msg.channel.createMessage({ embed });
				}

				await modlogs.update(
					{ channel: ch.id },
					{ where: { server: msg.guild.id } },
				);

				return msg.channel.createMessage(`> :white_check_mark: Successfully set modlogs channel to **"${ch.name}"**`);
			}
		}
	}
};
