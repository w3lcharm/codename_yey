module.exports = {
  name: "joinmessage",
  group: "settingsGroup",
  description: "joinmessageDescription",
  usage: "joinmessageUsage",
  requiredPermissions: "manageGuild",
  async run(client, msg, args, prefix, lang) {
    let [ channelID, ...message ] = args.raw;

    const dbItem = await db.welcomeMessages.findOrCreate({ where: { server: msg.guild.id } })
      .then(i => i[0]);

    if (!channelID) {
      let title = lang.joinmessageDisabled;

      const embed = {
        description: lang.joinmessageDisabled,
        color: Math.round(Math.random() * 16777216),
        footer: { text: lang.joinmessageFooter(prefix) },
      };

      if (dbItem.channel && msg.guild.channels.has(dbItem.channel)) {
        const channel = msg.guild.channels.get(dbItem.channel);

        embed.description = lang.joinmessageEnabled(channel.mention);
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
        return msg.channel.createMessage(lang.joinmessageDisableSuccess);
      }

      const channel = msg.guild.channels.find(c => c.mention === channelID ||
        c.id === channelID ||
        c.name === channelID);

      if (!channel || channel.type > 0) {
        return msg.channel.createMessage(lang.joinmessageInvalidChannel);
      }
      
      const messageStr = message.join(" ");

      if (!messageStr) {
        return msg.channel.createMessage(lang.joinmessageEmpty);
      }

      if (messageStr.length > 1536) {
        return msg.channel.createMessage(lang.joinMessageTooLong);
      }

      await dbItem.update({ channel: channel.id, message: messageStr });

      await msg.channel.createMessage(lang.joinmessageSuccess(channel.mention));
    }
  }
}
