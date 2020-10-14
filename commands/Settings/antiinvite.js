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
          lang.anttinviteDisabled,
        color: Math.round(Math.random() * 16777216),
        footer: { text: lang.antiinviteFooter(prefix) },
      };

      await msg.channel.createMessage({ embed });
    } else {
      if (action == "disable") {
        await dbItem.update({ action: null });
        return msg.channel.createMessage(lang.antiinviteDisableSuccess);
      }
      if (!allowedActions.includes(action)) {
        return msg.channel.createMessage(lang.antiinviteInvalidAction);
      }

      await dbItem.update({ action });
      await msg.channel.createMessage(lang.antiinviteEnableSuccess(action));
    }
  }
};
