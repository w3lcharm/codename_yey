const Discord = require("discord.js");

module.exports = {
    name: "stop",
    description: "Stops the music",
    guildOnly: true,
    async run(client, msg, args, prefix) {
		const queue = client.musicQueue.get(msg.guild.id);
		if (queue) {
			queue.songs = [];
			queue.connection.dispatcher.end();
		} else {
			return msg.reply("music is not playing now.");
		}
    }
}