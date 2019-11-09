const Discord = require("discord.js")

function isUserBot(user) {
	if (user.bot) return "Да";
	else return "Нет";
}

function userGame(member) {
	if (member.presence.game) return member.presence.game.toString();
	else return "ничего";
}

function userStatus(member) {
	if (member.presence.status == "online") return "Онлайн";
	else if (member.presence.status == "idle") return "Не активен";
	else if (member.presence.status == "dnd") return "Не беспокоить";
	else if (member.presence.status == "offline") return "Офлайн/невидимый";
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
			.setColor("RANDOM");
		if (member.nickname)
			embed.addField("Имя на этом сервере:", member.nickname)
		embed
			.addField("Статус:", userStatus(member))
			.addField("Играет в:", userGame(member))
			.addField("ID:", user.id)
			.addField("Роли на этом сервере:", Array.from(member.roles.values()).join(", "))
			.addField("Зарегистрировался:", user.createdAt)
			.addField("Вошел на этот сервер:", member.joinedAt)
			.addField("Бот?", isUserBot(user));
	
		await msg.channel.send(embed);
	}
};
