module.exports = {
  name: "leavemessage",
  group: "settingsGroup",
  description: "leavemessageDescription",
  usage: "joinmessageUsage",
  requiredPermissions: "manageGuild",
  async run(client, msg, args, prefix, lang) {
    let [ channelID, ...message ] = args.raw;

    const dbItem = await db.leaveMessages.findOrCreate({ where: { server: msg.guild.id } })
      .then(i => i[0]);

    if (!channelID) {
      const embed = {
        description: lang.leavemessageDisabled,
        color: await msg.author.embColor(),
        footer: { text: lang.leavemessageFooter(prefix) },
      };

      if (dbItem.channel && msg.guild.channels.has(dbItem.channel)) {
        const channel = msg.guild.channels.get(dbItem.channel);

        embed.description = lang.leavemessageEnabled(channel.mention);
        embed.fields = [
          {
            name: lang.joinMessage,
            value: dbItem.message,
          },
        ];
      }

      await msg.channel.createMessage({ embed });
    } else {
      if (channelID === "disable") {
        await dbItem.update({ channel: null, message: null });
        return msg.channel.createMessage(lang.leavemessageDisableSuccess);
      }

      const channel = msg.guild.channels.find(c => c.mention === channelID ||
        c.id === channelID ||
        c.name === channelID);

      if (!channel || channel.type > 0) {
        return msg.channel.createMessage(lang.joinmessageInvalidChannel);
      }

      if (!channel.memberHasPermission(msg.guild.me, "sendMessages") ||
        !channel.memberHasPermission(msg.guild.me, "embedLinks")) {
          const embed = {
            title: lang.modlogsDontHavePerms,
            description: lang.modlogsDontHavePermsDesc,
            color: 15158332,
            footer: {
              text: "codename_yey",
              icon_url: client.user.avatarURL,
            },
          };

          return msg.channel.createMessage({ embed });
      }
      
      const messageStr = message.join(" ");

      if (!messageStr) {
        return msg.channel.createMessage(lang.joinmessageEmpty);
      }

      if (messageStr.length > 1536) {
        return msg.channel.createMessage(lang.joinMessageTooLong);
      }

      await dbItem.update({ channel: channel.id, message: messageStr });

      await msg.channel.createMessage(lang.leavemessageSuccess(channel.mention));
    }
  }
}
