const { VoiceChannel } = require("eris");

module.exports = {
  name: "modlogs",
  group: "settingsGroup",
  description: "modlogsDescription",
  usage: "modlogsUsage",
  requiredPermissions: "manageGuild",
  guildOnly: true,
  async run(client, msg, args, prefix) {
    let channel = args[0];
    const modlogChannel = await db.modlogs.findOrCreate({ where: { server: msg.guild.id } })
      .then(i => i[0].channel ? client.getChannel(i[0].channel) : undefined);

    if (!channel) {
      let description;
      if (modlogChannel) {
        description = msg.t("modlogsEnabled", modlogChannel.mention);
      } else {
        description = msg.t("modlogsDisabled");
      }

      const embed = {
        title: msg.t("modlogs"),
        description,
        color: await msg.author.embColor(),
        footer: {
          text: msg.t("modlogsTip", prefix),
        },
      };

      return msg.reply({ embed });
    } else {
      if (channel === "disable") {
        await db.modlogs.update(
          { channel: null },
          { where: { server: msg.guild.id } }
        );

        return msg.reply(msg.t("modlogsDisableSuccess"));
      } else {
        if (channel.startsWith("<#")) {
          channel = channel.replace("<#", "").replace(">", "");
        }

        const ch = msg.guild.channels.find(c => c.id === channel || c.name === channel);
        if (!ch || (ch && ch.type > 0)) {
          return msg.reply(msg.t("invalidChannel"));
        }
        if (!ch.memberHasPermission(msg.guild.me, "sendMessages") || !ch.memberHasPermission(msg.guild.me, "embedLinks")) {
          const embed = {
            title: msg.t("modlogsDontHavePerms"),
            description: msg.t("modlogsDontHavePermsDesc"),
            color: 0x57f287,
          };
          return msg.reply({ embed });
        }

        await db.modlogs.update(
          { channel: ch.id },
          { where: { server: msg.guild.id } },
        );

        return msg.reply(msg.t("modlogsSuccess", ch.name));
      }
    }
  }
};
