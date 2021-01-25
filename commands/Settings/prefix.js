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
        color: await msg.author.embColor(),
        footer: { text: lang.prefixFooter(prefix) },
      };

      await msg.reply({ embed });
    } else {
      if (prefixArg.length > 10) {
        return msg.reply(lang.prefixCantBeLong);
      }

      const guildPrefix = await db.prefixes.findOrCreate({ where: { server: msg.guild.id } })
        .then(i => i[0]);
      await guildPrefix.update({ prefix: prefixArg.toLowerCase() });

      await msg.reply(lang.prefixSuccess(prefixArg));
    }
  }
}
