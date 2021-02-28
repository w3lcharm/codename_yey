module.exports = {
  name: "play",
  group: "musicGroup",
  description: "playDescription",
  usage: "playUsage",
  argsRequired: true,
  aliases: [ "p" ],
  disabled: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.raw.length) {
      return msg.reply(lang.commandUsage(prefix, this));
    }

    if (!msg.member.voiceState.channelID) {
      return msg.reply(lang.playNotInVoiceChannel);
    }

    const query = args.raw.join(" ");

    const res = await client.lavalinkManager.search({ query, source: "soundcloud" }, msg.author);
    if (res.loadType == "LOAD_FAILED") {
      return msg.reply(lang.playFailed(res.exception.message));
    } else if (res.loadType == "PLAYLIST_LOADED") {
      return msg.reply(lang.playlistsNotSupported);
    }

    const track = res.tracks[0];
    if (!track) return msg.reply(lang.trackNotFound);

    const player = client.lavalinkManager.create({
      guild: msg.guild.id,
      voiceChannel: msg.member.voiceState.channelID,
      textChannel: msg.channel.id,
    });

    player.queue.add(track);

    if (!player.get("lang")) player.set("lang", lang);

    if (!player.playing && !player.paused && !player.queue.size) {
      player.connect();
      player.play();
    }

    await msg.reply(lang.playAddedToQueue(track.title));
  }
}
