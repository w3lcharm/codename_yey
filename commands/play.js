const Discord = require("discord.js");
const ytdl = require("ytdl-core");

function playMusic(client, guild, song, msg) {
	const queue = client.musicQueue.get(guild.id);
	const embed = new Discord.MessageEmbed();
	if (!song) {
		queue.voiceChannel.leave();
		client.musicQueue.delete(guild.id);
		embed.setTitle(`All songs have been played.`)
			.setFooter("codename_yey", client.user.displayAvatarURL());
		msg.channel.send(embed);
		return;
	}

	try {
		const dispatcher = queue.connection.play(song.stream, { volume: false })
			.on("end", async () => {
				queue.songs.shift();
				playMusic(client, guild, queue.songs[0], msg);
			});
	
		embed.setTitle(`:arrow_forward: Playing **${song.title}**`)
			.setFooter("codename_yey", client.user.displayAvatarURL());
		msg.channel.send(embed);
	} catch (err) {
		console.error(err.stack);
	}
}

module.exports = {
	name: "play",
	description: "Plays the music in the voice channel you joined.",
	usage: "<URL or search string>",
	guildOnly: true,
	async run(client, msg, args, prefix) {
		if (!args.length)
			return msg.channel.send(`> Usage: \`${prefix}${this.name} ${this.usage}\``);

		const embed = new Discord.MessageEmbed();

		const voiceChannel = msg.member.voice.channel;
		if (!voiceChannel)
			return msg.reply("you need to connect to voice channel before using this command.");
		
		const searchString = msg.content.slice(this.name.length + prefix.length + 1);
		const song = await ytdl.getInfo(searchString);
		const songStruct = {
			title: song.title,
			url: song.video_url,
			stream: ytdl(song.video_url, { filter: "audioonly" })
		};
		
		const serverQueue = client.musicQueue.get(msg.guild.id);
		if (!serverQueue) {
			const queueStruct = {
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 100,
				playing: true,
			};

			client.musicQueue.set(msg.guild.id, queueStruct);
			queueStruct.songs.push(songStruct);
			
			const connection = await voiceChannel.join();
			queueStruct.connection = connection;

			playMusic(client, msg.guild, queueStruct.songs[0], msg);
		} else {
			serverQueue.songs.push(songStruct);

			embed.setTitle(`Added **${songStruct.title}** to queue.`)
				.setFooter("codename_yey", client.user.displayAvatarURL());
			await msg.channel.send(embed);
		}
	}
}