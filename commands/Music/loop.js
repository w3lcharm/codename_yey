const { run } = require("./play");

module.exports = {
  name: "loop",
  group: "musicGroup",
  description: "loopDescription",
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

    player.setTrackRepeat(!player.trackRepeat);

    await msg.reply(player.trackRepeat ? msg.t("loopEnabled") : msg.t("loopDisabled"));
  }
}