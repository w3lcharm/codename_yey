module.exports = {
  name: "prefix",
  group: "settingsGroup",
  description: "prefixDescription",
  usage: "prefixUsage",
  requiredPermissions: "manageGuild",
  async run(client, msg, args, prefix, lang) {
    const prefixArg = args.raw[0];
    if (!prefixArg) {
      const embed = {
        description: lang.prefixDesc(prefix),
        color: Math.round(Math.random() * 16777216),
        footer: { text: lang.prefixFooter(prefix) },
      };

      await msg.channel.createMessage({ embed });
    } else {
      if (prefixArg.length > 10) {
        return msg.channel.createMessage(lang.prefixCantBeLong);
      }

      const guildPrefix = await db.prefixes.findOrCreate({ where: { server: msg.guild.id } })
        .then(i => i[0]);
      await guildPrefix.update({ prefix: prefixArg.toLowerCase() });

      await msg.channel.createMessage(lang.prefixSuccess(prefixArg));
    }
  }
}
