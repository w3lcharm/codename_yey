module.exports = {
  name: "skip",
  group: "musicGroup",
  description: "skipDescription",
  async run(client, msg, args, prefix, lang) {
    if (!msg.member.voiceState.channelID) {
      return msg.channel.createMessage(lang.playNotInVoiceChannel);
    }

    const player = client.lavalinkManager.players.get(msg.guild.id);
    if (!player) {
      return msg.channel.createMessage(lang.notPlaying);
    }

    player.stop();

    await msg.channel.createMessage(lang.skipping);
  }
}
