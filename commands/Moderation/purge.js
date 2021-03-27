module.exports = {
  name: "purge",
  group: "moderationGroup",
  description: "purgeDescription",
  guildOnly: true,
  requiredPermissions: "manageMessages",
  usage: "purgeUsage",
  cooldown: 10,
  argsRequired: true,
  async run(client, msg, args, prefix) {
    if (!args.length)
      return msg.reply(msg.t("commandUsage", prefix, this));

    const amount = parseInt(args[0]);

    if (isNaN(amount))
      return msg.reply(msg.t("amountIsNaN"));

    if (amount < 1)
      return msg.reply(msg.t("notLessThan1Msg"));
    if (amount > 100)
      return msg.reply(msg.t("notMoreThan100Msgs"));
    try {
      await msg.channel.purge(amount + 1);

      const embed = {
        title: msg.t("purgeSuccess", amount),
        description: msg.t("msgWillBeDeleted"),
        timestamp: new Date().toISOString(),
        color: 3066993,
      };

      const message = await msg.channel.createMessage({ embed });
      setTimeout(() => {
        message.delete().catch(() => {});
      }, 5000);
    } catch (err) {
      let description;
      if (!msg.guild.me.permission.has("manageMessages")) {
        description = msg.t("botDontHavePerms", msg.t("permissions").manageMessages);
      } else {
        description = msg.t("somethingWentWrong");
        client.emit("commandError", this.name, msg, err, false);
      }

      let embed = {
        title: msg.t("purgeFailed"),
        color: 15158332,
        description,
      };
      await msg.channel.createMessage({ embed });
    }
  }
};
