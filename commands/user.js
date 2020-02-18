const Discord = require("discord.js")

function userStatus(member) {
	if (member.presence.status == "online") return "Online";
	else if (member.presence.status == "idle") return "Idle";
	else if (member.presence.status == "dnd") return "Do not disturb";
	else if (member.presence.status == "offline") return "Offline/invisible";
}

module.exports = {
	name: "user",
	description: "Shows info about you or the mentioned user.",
	guildOnly: true,
	usage: "[user]",
	async run(client, msg, args, prefix) {
		let member, user;
		if (!args.length) {
			user = msg.author;
			member = msg.guild.member(user);
		} else {
			user = msg.mentions.users.first() || client.users.cache.find(u => u.id == args[0] || u.tag == args[0]);
			member = msg.guild.member(user);
		}

		if (member == undefined || user == undefined) return;

		const embed = new Discord.MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor("RANDOM");
		if (member.nickname)
			embed.addField("Name on this server:", member.nickname)
		embed
			.addField("Status:", userStatus(member))
			.addField("Playing:", member.presence.activities.length ? member.presence.activities[0].name : "nothing")
			.addField("ID:", user.id)
			.addField("Roles:", Array.from(member.roles.cache.values()).join(", "))
			.addField("Registered at:", user.createdAt)
			.addField("Joined this server at:", member.joinedAt)
			.addField("Bot?", user.bot ? "Yes" : "No");
	
		await msg.channel.send(embed);
	}
};
