const Discord = require("discord.js");

module.exports = {
    name: "pause",
    description: "Pauses the music.",
    guildOnly: true,
    async run(client, msg, args, prefix) {
		let embed;
        const queue = client.musicQueue.get(msg.guild.id);
        if (queue) {
			if (!queue.playing)
				return msg.reply("music is already paused.");
			
			queue.connection.dispatcher.pause();
			queue.playing = false;

			embed = new Discord.MessageEmbed()
				.setTitle(":pause_button: Paused.")
				.setDescription(`Type ${prefix}resume to resume the playing.`)
				.setFooter("codename_yey", client.user.displayAvatarURL());
			await msg.channel.send(embed);
        } else {
			return msg.reply("music is not playing now.");
		}
    }
}