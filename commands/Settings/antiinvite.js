const allowedActions = [ "delete", "warn", "kick", "ban" ];

module.exports = {
  name: "antiinvite",
  group: "settingsGroup",
  description: "antiinviteDescription",
  usage: "antiinviteUsage",
  requiredPermissions: "manageGuild",
  async run(client, msg, args, prefix, lang) {
    const action = args[0];

    const dbItem = await db.antiInvite.findOrCreate({ where: { server: msg.guild.id } })
      .then(i => i[0]);

    if (!action) {
      const embed = {
        description: dbItem.action ?
          lang.antiinviteEnabled(dbItem.action) :
          lang.antiinviteDisabled,
        color: await msg.author.embColor(),
        footer: { text: lang.antiinviteFooter(prefix) },
      };

      await msg.reply({ embed });
    } else {
      if (action == "disable") {
        await dbItem.update({ action: null });
        return msg.reply(lang.antiinviteDisableSuccess);
      }
      if (!allowedActions.includes(action)) {
        return msg.reply(lang.antiinviteInvalidAction);
      }

      await dbItem.update({ action });
      await msg.reply(lang.antiinviteEnableSuccess(action));
    }
  }
};
