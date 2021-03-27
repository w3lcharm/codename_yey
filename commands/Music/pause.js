module.exports = {
  name: "pause",
  group: "musicGroup",
  description: "pauseDescription",
  async run(client, msg, args, prefix) {
    if (
      !msg.member.voiceState.channelID || 
      (msg.guild.me.voiceState.channelID && msg.member.voiceState.channelID != msg.guild.me.voiceState.channelID)
    ) {
      return msg.reply(msg.t("playNotInVoiceChannel"));
    }

    const player = client.lavalinkManager.players.get(msg.guild.id);
    if (!player) {
      return msg.reply(msg.t("notPlaying"));
    }

    if (player.paused) {
      return msg.reply(msg.t("alreadyPaused"));
    }

    player.pause(true);

    await msg.reply(msg.t("paused", prefix));
  }
}
