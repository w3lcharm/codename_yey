module.exports = {
  name: "skip",
  group: "music",
  description: "skipDescription",
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

    player.stop();

    await msg.reply(msg.t("skipping"));
  }
}
