const Discord = require("discord.js")

function userBot(user) {
	if (user.bot) return "Да";
	else return "Нет";
}

module.exports = {
	name: "user",
	description: "Показывает информацию о вас или о упомянутом пользователе.",
	guildOnly: true,
	usage: "[пользователь]",
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
			.setColor("RANDOM")
			.addField("Имя на этом сервере:", member.nickname)
			.addField("Играет в:", "ничего" || member.presence.game.toString())
			.addField("ID:", user.id)
			.addField("Зарегистрировался:", user.createdAt)
			.addField("Бот?", userBot(user));
	
		await msg.channel.send(embed);
	}
};
