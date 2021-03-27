module.exports = {
  name: "volume",
  group: "musicGroup",
  description: "volumeDescription",
  usage: "volumeUsage",
  aliases: [ "vol" ],
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

    const volumeNum = parseInt(args[0]);
    if (!volumeNum) {
      const embed = {
        description: msg.t("currentVol", player.volume),
        color: await msg.author.embColor(),
        footer: { text: msg.t("volumeTip", prefix) },
      };

      await msg.reply({ embed });
    } else {
      if (volumeNum < 1 || volumeNum > 100) {
        return msg.reply(msg.t("volumeInvalid"));
      }

      player.setVolume(volumeNum);

      await msg.reply(msg.t("volumeChanged", volumeNum));
    }
  }
}