module.exports = {
  name: "stop",
  group: "musicGroup",
  description: "stopDescription",
  async run(client, msg, args, prefix, lang) {
    if (!msg.member.voiceState.channelID) {
      return msg.channel.createMessage(lang.playNotInVoiceChannel);
    }

    const player = client.lavalinkManager.players.get(msg.guild.id);
    if (!player) {
      return msg.channel.createMessage(lang.notPlaying);
    }

    player.queue.clear();
    player.stop();
  }
}
