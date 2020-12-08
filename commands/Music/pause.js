module.exports = {
  name: "pause",
  group: "musicGroup",
  description: "pauseDescription",
  async run(client, msg, args, prefix, lang) {
    if (!msg.member.voiceState.channelID) {
      return msg.channel.createMessage(lang.playNotInVoiceChannel);
    }

    const player = client.lavalinkManager.players.get(msg.guild.id);
    if (!player) {
      return msg.channel.createMessage(lang.notPlaying);
    }

    if (player.paused) {
      return msg.channel.createMessage(lang.alreadyPaused);
    }

    player.pause(true);

    await msg.channel.createMessage(lang.paused(prefix));
  }
}
