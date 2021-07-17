const allowedActions = [ "delete", "warn", "kick", "ban" ];

module.exports = {
  name: "antiinvite",
  group: "settings",
  description: "antiinviteDescription",
  usage: "antiinviteUsage",
  requiredPermissions: "manageGuild",
  async run(client, msg, args, prefix) {
    const action = args[0];

    const dbItem = await db.antiInvite.findOrCreate({ where: { server: msg.guild.id } })
      .then(i => i[0]);

    if (!action) {
      const embed = {
        description: dbItem.action ?
          msg.t("antiinviteEnabled", dbItem.action) :
          msg.t("antiinviteDisabled"),
        color: await msg.author.embColor(),
        footer: { text: msg.t("antiinviteFooter", prefix) },
      };

      await msg.reply({ embed });
    } else {
      if (action == "disable") {
        await dbItem.update({ action: null });
        return msg.reply(msg.t("antiinviteDisableSuccess"));
      }
      if (!allowedActions.includes(action)) {
        return msg.reply(msg.t("antiinviteInvalidAction"));
      }

      await dbItem.update({ action });
      await msg.reply(msg.t("antiinviteEnableSuccess", action));
    }
  }
};
