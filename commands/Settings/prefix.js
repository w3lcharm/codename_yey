module.exports = {
  name: "prefix",
  group: "settingsGroup",
  description: "prefixDescription",
  usage: "prefixUsage",
  requiredPermissions: "manageGuild",
  async run(client, msg, args, prefix) {
    const prefixArg = args.raw[0];
    if (!prefixArg) {
      const embed = {
        description: msg.t("prefixDesc", prefix),
        color: await msg.author.embColor(),
        footer: { text: msg.t("prefixFooter", prefix) },
      };

      await msg.reply({ embed });
    } else {
      if (prefixArg.length > 10) {
        return msg.reply(msg.t("prefixCantBeLong"));
      }

      const guildPrefix = await db.prefixes.findOrCreate({ where: { server: msg.guild.id } })
        .then(i => i[0]);
      await guildPrefix.update({ prefix: prefixArg.toLowerCase() });

      client.prefixCache[msg.guild.id] = guildPrefix;

      await msg.reply(msg.t("prefixSuccess", prefixArg));
    }
  }
}
