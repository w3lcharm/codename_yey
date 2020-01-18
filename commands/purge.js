const Discord = require("discord.js");

module.exports = {
	name: "purge",
	description: "Deletes the specified amount of messages (from 1 to 100) in the channel.\nYou must have the \"Manage messages\" permission to use this command.",
	guildOnly: true,
	usage: "<amount>",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		if (msg.member.hasPermission("MANAGE_MESSAGES")) {
			const amount = parseInt(args[0]);
			if (amount > 100)
				return msg.channel.send("> :x: Not more than 100 message at a time.")
			else if (amount < 1)
				return msg.channel.send("> :x: Not less than 1 message at a time.");
			else {
				if (msg.guild.me.hasPermission("MANAGE_MESSAGES")) {
					await msg.channel.bulkDelete(amount + 1);
					let embed = new Discord.MessageEmbed()
						.setTitle(`:white_check_mark: Successfully deleted ${amount} messages.`)
						.setColor("GREEN")
						.setTimestamp();
					let message = await msg.channel.send(embed);
					setTimeout(async () => await message.delete(), 5000);
				} else
					return msg.channel.send("> :x: I can't delete messages in this channel. Please give me the \"Manage messages\" permission and try again.");
			}
		} else
			await msg.channel.send("> :x: You don't have permissions to use this command.");
	}
};
