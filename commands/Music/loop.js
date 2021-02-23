const { run } = require("./play");

module.exports = {
  name: "loop",
  group: "musicGroup",
  description: "loopDescription",
  async run(client, msg, args, prefix, lang) {
    if (!msg.member.voiceState.channelID) {
      return msg.reply(lang.playNotInVoiceChannel);
    }

    const player = client.lavalinkManager.players.get(msg.guild.id);
    if (!player) {
      return msg.reply(lang.notPlaying);
    }

    player.setTrackRepeat(!player.trackRepeat);

    await msg.reply(player.trackRepeat ? lang.loopEnabled : lang.loopDisabled);
  }
}