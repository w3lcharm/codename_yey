module.exports = {
  name: "resume",
  group: "music",
  description: "musicDescription",
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

    if (player.playing) {
      return msg.reply(msg.t("alreadyPlaying"));
    }

    player.pause(false);

    await msg.reply(msg.t("resumed"));
  }
}
