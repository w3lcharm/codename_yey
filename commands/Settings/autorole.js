module.exports = {
  name: "autorole",
  group: "settings",
  description: "autoroleDescription",
  requiredPermissions: "manageGuild",
  usage: "autoroleUsage",
  guildOnly: true,
  async run(client, msg, args, prefix) {
    let roleID = args[0];
    if (roleID && roleID.startsWith("<@&")) {
      roleID = roleID.replace("<@&", "").replace(">", "");
    }

    if (!roleID) {
      const dbItem = await db.autorole.findOne({ where: { server: msg.channel.guild.id } });
      let role;
      if (dbItem) role = msg.channel.guild.roles.get(dbItem.autorole);

      const embed = {
        description: role ? msg.t("autoroleEnabled", role.name) : msg.t("autoroleDisabled"),
        color: await msg.author.embColor(),
        footer: {
          text: msg.t("autoroleTip", prefix),
        },
      };

      await msg.reply({ embed });
    } else {
      await db.autorole.findOrCreate({ where: { server: msg.channel.guild.id } });
      if (roleID == "disable") {
        await db.autorole.update({ autorole: null }, { where: { server: msg.channel.guild.id } });
        await msg.reply(msg.t("autoroleDisableSuccess"));
      } else {
        const role = msg.channel.guild.roles.find(r => r.id == roleID || r.name == roleID);
        if (!role) return msg.reply(msg.t("invalidRoleID"));
        if (msg.guild.me.highestRole.position <= role.position) {
          return msg.reply(msg.t("autoroleRoleHigher"));
        }

        await db.autorole.update({ autorole: role.id }, { where: { server: msg.channel.guild.id } });
        await msg.reply(msg.t("autoroleSuccess", role.name));
      }
    }
  }
}
