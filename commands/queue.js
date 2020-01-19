const Discord = require("discord.js");

module.exports = {
	name: "queue",
	description: "Shows the music queue.",
	guildOnly: true,
	async run(client, msg, args, prefix) {
		const queue = client.musicQueue.get(msg.guild.id);
		if (queue) {
			const description = queue.songs.map((song, number) => `${number + 1}: **${song.title}**`).join("\n");

			const embed = new Discord.MessageEmbed()
				.setTitle("Queue")
				.setDescription(description)
				.setFooter("codename_yey", client.user.displayAvatarURL());
			await msg.channel.send(embed);
		} else {
			return msg.reply("music is not playing now.");
		}
	}
}
