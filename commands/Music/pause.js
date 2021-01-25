module.exports = {
  name: "pause",
  group: "musicGroup",
  description: "pauseDescription",
  async run(client, msg, args, prefix, lang) {
    if (!msg.member.voiceState.channelID) {
      return msg.reply(lang.playNotInVoiceChannel);
    }

    const player = client.lavalinkManager.players.get(msg.guild.id);
    if (!player) {
      return msg.reply(lang.notPlaying);
    }

    if (player.paused) {
      return msg.reply(lang.alreadyPaused);
    }

    player.pause(true);

    await msg.reply(lang.paused(prefix));
  }
}
