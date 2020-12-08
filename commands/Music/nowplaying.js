module.exports = {
  name: "nowplaying",
  group: "musicGroup",
  description: "nowplayingDescription",
  aliases: [ "np" ],
  async run(client, msg, args, prefix, lang) {
    if (!msg.member.voiceState.channelID) {
      return msg.channel.createMessage(lang.playNotInVoiceChannel);
    }

    const player = client.lavalinkManager.players.get(msg.guild.id);
    if (!player) {
      return msg.channel.createMessage(lang.notPlaying);
    }

    const track = player.queue.current;
    console.log(player.queue);

    const embed = {
      title: lang.nowPlaying,
      description: `[${track.title}](${track.uri})`,
      footer: { text: lang.playAuthor(track.author) },
    };

    await msg.channel.createMessage({ embed });
  }
}
