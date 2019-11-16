const Discord = require("discord.js");

module.exports = {
    name: "ban",
    description: "Банит указанного пользователя.\nВы должны иметь разрешение \"Банить участников\" для использования этой команды.",
    guildOnly: true,
    usage: "<пользователь> <причина>",
    async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`Использование: \`${prefix}${this.name} ${this.usage}\``);

        const userID = args.shift();
        const reason = args.join(" ");

        let member = msg.mentions.members.first() || msg.guild.member(client.users.get(userID));

		if (!member) return;
		
		if (msg.guild.member(msg.author).hasPermission("BAN_MEMBERS")) {
			if (member.user.id == msg.author.id)
				return msg.channel.send("Зачем вы хотите забанить себя?");
			
			if (member.hasPermission("ADMINISTRATOR"))
				return msg.channel.send("Я не могу забанить этого пользователя, так как он является администратором на этом сервере.");
			
			member.ban(reason);

			const embed = new Discord.RichEmbed()
				.setAuthor(`${member.user.tag} был забанен`, member.user.avatarURL || member.user.defaultAvatarURL)
				.setTitle("Причина:")
				.setDescription(reason || 'отсутствует')
				.setColor("GREEN")
				.setTimestamp();
			
			await msg.channel.send(embed);
		} else {
			await msg.reply("вы должны иметь разрешения на использование этой команды.");
		}
    }
}
