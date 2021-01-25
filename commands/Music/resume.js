module.exports = {
  name: "resume",
  group: "musicGroup",
  description: "musicDescription",
  async run(client, msg, args, prefix, lang) {
    if (!msg.member.voiceState.channelID) {
      return msg.reply(lang.playNotInVoiceChannel);
    }

    const player = client.lavalinkManager.players.get(msg.guild.id);
    if (!player) {
      return msg.reply(lang.notPlaying);
    }

    if (player.playing) {
      return msg.reply(lang.alreadyPlaying);
    }

    player.pause(false);

    await msg.reply(lang.resumed);
  }
}
