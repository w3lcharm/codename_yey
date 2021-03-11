const parseTime = require("../../utils/parseTime");

module.exports = {
  name: "nowplaying",
  group: "musicGroup",
  description: "nowplayingDescription",
  aliases: [ "np" ],
  async run(client, msg, args, prefix, lang) {
    if (
      !msg.member.voiceState.channelID || 
      (msg.guild.me.voiceState.channelID && msg.member.voiceState.channelID != msg.guild.me.voiceState.channelID)
    ) {
      return msg.reply(lang.playNotInVoiceChannel);
    }

    const player = client.lavalinkManager.players.get(msg.guild.id);
    if (!player) {
      return msg.reply(lang.notPlaying);
    }

    const track = player.queue.current;

    const trackDuration = parseTime(Math.floor(track.duration / 1000));
    const playerPos = parseTime(Math.floor(player.position / 1000));

    const embed = {
      title: lang.nowPlaying,
      description: `[${track.title}](${track.uri})`,
      thumbnail: { url: track.thumbnail },
      fields: [
        {
          name: lang.duration,
          value: `${playerPos} / ${trackDuration}`,
        },
      ],
      footer: { text: lang.playAuthor(track.author) },
    };

    await msg.reply({ embed });
  }
}
