const Discord = require("discord.js");

module.exports = {
    name: "resume",
    description: "Resumes the music.",
    guildOnly: true,
    async run(client, msg, args, prefix) {
		let embed;
        const queue = client.musicQueue.get(msg.guild.id);
        if (queue) {
			if (queue.playing)
				return msg.reply("music is already playing.");
			
			queue.connection.dispatcher.resume();
			queue.playing = true;

			embed = new Discord.MessageEmbed()
				.setTitle(":arrow_forward: Resumed.")
				.setFooter("codename_yey", client.user.displayAvatarURL());
			await msg.channel.send(embed);
        } else {
			return msg.reply("music is not playing now.");
		}
    }
}