module.exports = {
  name: "play",
  group: "music",
  description: "playDescription",
  usage: "playUsage",
  argsRequired: true,
  aliases: [ "p" ],
  disabled: true,
  async run(client, msg, args, prefix) {
    if (!args.raw.length) {
      return msg.reply(msg.t("commandUsage", prefix, this));
    }

    if (
      !msg.member.voiceState.channelID || 
      (msg.guild.me.voiceState.channelID && msg.member.voiceState.channelID != msg.guild.me.voiceState.channelID)
    ) {
      return msg.reply(msg.t("playNotInVoiceChannel"));
    }

    const query = args.raw.join(" ");

    const res = await client.lavalinkManager.search(query, msg.author);
    if (res.loadType == "LOAD_FAILED") {
      return msg.reply(msg.t("trackLoadFailed", res.exception.message));
    } else if (res.loadType == "PLAYLIST_LOADED") {
      return msg.reply(msg.t("playlistsNotSupported"));
    }

    const track = res.tracks[0];
    if (!track) return msg.reply(msg.t("trackNotFound"));

    const player = client.lavalinkManager.create({
      guild: msg.guild.id,
      voiceChannel: msg.member.voiceState.channelID,
      textChannel: msg.channel.id,
    });

    player.queue.add(track);

    if (!player.get("lang")) player.set("lang", client.languages.get(msg.author.lang));

    if (!player.playing && !player.paused && !player.queue.size) {
      player.connect();
      player.play();
    }

    await msg.reply(msg.t("playAddedToQueue", track.title));
  }
}
