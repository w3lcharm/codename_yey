const Discord = require("discord.js")

module.exports = {
	name: "hackban",
	description: "Hackbans the user from the server. Useful if specified user was left the server.\nYou must have the \"Ban members\" permission to do this.",
	usage: "<id> [reason]",
	guildOnly: true,
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		if (msg.member.hasPermission("BAN_MEMBERS")) {
			if (!msg.guild.me.hasPermission("BAN_MEMBERS"))
                                return msg.channel.send("> :x: I don't have the permissions to do this. Please give me the \"Ban members\" permission and try again.");
			const userID = args.shift();
			const user = await client.fetchUser(userID);
			const reason = args.join(" ");

			if (userID == msg.author.id) return;
			if (userID == client.user.id) return;

			if (!user) return;

			await msg.guild.ban(user, reason);

			const embed = new Discord.MessageEmbed()
				.setTitle(`:white_check_mark: User with ID \`${userID}\` was successfully banned.`)
				.addField("Reason:", reason || "not provided")
				.setColor("GREEN")
				.setTimestamp();
			await msg.channel.send(embed);
		} else {
		await msg.channel.send("> :x: You don't have permissions to use this command.");
		}
	}
};
