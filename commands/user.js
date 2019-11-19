const Discord = require("discord.js")

function isUserBot(user) {
	if (user.bot) return "Yes";
	else return "No";
}

function userGame(member) {
	if (member.presence.game) return member.presence.game.toString();
	else return "nothing";
}

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
			user = msg.mentions.users.first() || client.users.find(u => u.id == args[0]);
			member = msg.guild.member(user);
		}

		if (member == undefined || user == undefined) return;

		const embed = new Discord.RichEmbed()
			.setAuthor(user.tag, user.avatarURL || user.defaultAvatarURL)
			.setColor("RANDOM");
		if (member.nickname)
			embed.addField("Name on this server:", member.nickname)
		embed
			.addField("Status:", userStatus(member))
			.addField("Playing:", userGame(member))
			.addField("ID:", user.id)
			.addField("Roles:", Array.from(member.roles.values()).join(", "))
			.addField("Registered at:", user.createdAt)
			.addField("Joined this server at:", member.joinedAt)
			.addField("Bot?", isUserBot(user));
	
		await msg.channel.send(embed);
	}
};
