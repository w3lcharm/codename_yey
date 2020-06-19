module.exports = {
  name: "autorole",
  group: "settingsGroup",
  description: "autoroleDescription",
  requiredPermissions: "manageGuild",
  usage: "autoroleUsage",
  guildOnly: true,
  async run(client, msg, args, prefix, lang) {
    let roleID = args[0];
    if (roleID && roleID.startsWith("<@&"))
      roleID = roleID.replace("<@&", "").replace("<@&", "");

    if (!roleID) {
      const dbItem = await db.autorole.findOne({ where: { server: msg.channel.guild.id } });
      let role;
      if (dbItem) role = msg.channel.guild.roles.get(dbItem.autorole);

      const embed = {
        title: lang.autorole,
        description: role ? lang.autoroleEnabled(role.name) : lang.autoroleDisabled,
        color: Math.round(Math.random() * 16777216) + 1,
        footer: {
          text: lang.autoroleTip(prefix),
        },
      };

      await msg.channel.createMessage({ embed });
    } else {
      await autorole.findOrCreate({ where: { server: msg.channel.guild.id } });
      if (roleID == "disable") {
        await db.autorole.update({ autorole: null }, { where: { server: msg.channel.guild.id } });
        await msg.channel.createMessage(lang.autoroleDisableSuccess);
      } else {
        const role = msg.channel.guild.roles.find(r => r.id == roleID || r.name == roleID);
        if (!role) return msg.channel.createMessage(lang.invalidRoleID);

        await db.autorole.update({ autorole: role.id }, { where: { server: msg.channel.guild.id } });
        await msg.channel.createMessage(lang.autoroleSuccess(role.name));
      }
    }
  }
}
