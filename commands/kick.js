const Discord = require("discord.js");

module.exports = {
	name: "kick",
	description: "Кикает пользователя с сервера.\nВы должны иметь разрешение \"Кикать участников\" для того, чтобы воспользоваться этой командой.",
	guildOnly: true,
	usage: "<пользователь> [причина]",
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`Использование: \`${prefix}${this.name} ${this.usage}\``);

		const userID = args.shift();
		const reason = args.join(" ");
		let member = msg.mentions.members.first() || msg.guild.member(client.users.find(u => u.id == userID));
		if (!member) return;

		if (msg.guild.member(msg.author).hasPermission("KICK_MEMBERS")) {
			if (member.user.id == msg.author.id)
				return msg.channel.send("Кикнуть себя? Вы серьёзно?");

			if (member.hasPermission("ADMINISTRATOR"))
				return msg.channel.send("Я не смогу кикнуть этого пользователя, так как он является администратором на этом сервере.");

			await member.kick(reason);

			const embed = new Discord.RichEmbed()
				.setAuthor(`${member.user.tag} был кикнут`, member.user.avatarURL || member.user.defaultAvatarURL)
				.setTitle("Причина:")
				.setDescription(reason || "отсутствует")
				.setColor("RANDOM")
				.setTimestamp();
			
			await msg.channel.send(embed);
		} else {
			return msg.reply("вы должны иметь разрешения на использование этой команды.");
		}
	}
}
			


			

