module.exports = {
  name: "skip",
  group: "musicGroup",
  description: "skipDescription",
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

    player.stop();

    await msg.reply(lang.skipping);
  }
}
