module.exports = {
  name: "resume",
  group: "musicGroup",
  description: "musicDescription",
  async run(client, msg, args, prefix, lang) {
    if (!msg.member.voiceState.channelID) {
      return msg.channel.createMessage(lang.playNotInVoiceChannel);
    }

    const player = client.lavalinkManager.players.get(msg.guild.id);
    if (!player) {
      return msg.channel.createMessage(lang.notPlaying);
    }

    if (player.playing) {
      return msg.channel.createMessage(lang.alreadyPlaying);
    }

    player.pause(false);

    await msg.channel.createMessage(lang.resumed);
  }
}
