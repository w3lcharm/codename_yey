module.exports = {
  name: "queueloop",
  group: "musicGroup",
  description: "queueloopDescription",
  aliases: [ "qloop" ],
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

    player.setQueueRepeat(!player.queueRepeat);

    await msg.reply(player.queueRepeat ? msg.t("queueloopEnabled") : msg.t("queueloopDisabled"));
  }
}