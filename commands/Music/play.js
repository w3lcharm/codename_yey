module.exports = {
  name: "play",
  group: "musicGroup",
  description: "playDescription",
  usage: "playUsage",
  async run(client, msg, args, prefix, lang) {
    if (!args.raw.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    }

    if (!msg.member.voiceState.channelID) {
      return msg.channel.createMessage(lang.playNotInVoiceChannel);
    }

    const query = args.raw.join(" ");

    const res = await client.lavalinkManager.search(query, msg.author);
    if (res.loadType == "LOAD_FAILED") throw res.exception;
    else if (res.loadType == "PLAYLIST_LOADED") return msg.channel.createMessage(lang.playlistsNotSupported);

    const player = client.lavalinkManager.create({
      guild: msg.guild.id,
      voiceChannel: msg.member.voiceState.channelID,
      textChannel: msg.channel.id,
    });

    player.connect();
    player.queue.add(res.tracks[0]);

    if (!player.get("lang")) player.set("lang", lang);

    if (!player.playing && !player.paused && !player.queue.size) {
      player.play();
    }

    await msg.channel.createMessage(lang.playAddedToQueue(res.tracks[0].title));
  }
}
