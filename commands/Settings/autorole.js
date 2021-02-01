module.exports = {
  name: "autorole",
  group: "settingsGroup",
  description: "autoroleDescription",
  requiredPermissions: "manageGuild",
  usage: "autoroleUsage",
  guildOnly: true,
  async run(client, msg, args, prefix, lang) {
    let roleID = args[0];
    if (roleID && roleID.startsWith("<@&")) {
      roleID = roleID.replace("<@&", "").replace(">", "");
    }

    if (!roleID) {
      const dbItem = await db.autorole.findOne({ where: { server: msg.channel.guild.id } });
      let role;
      if (dbItem) role = msg.channel.guild.roles.get(dbItem.autorole);

      const embed = {
        description: role ? lang.autoroleEnabled(role.name) : lang.autoroleDisabled,
        color: await msg.author.embColor(),
        footer: {
          text: lang.autoroleTip(prefix),
        },
      };

      await msg.reply({ embed });
    } else {
      await db.autorole.findOrCreate({ where: { server: msg.channel.guild.id } });
      if (roleID == "disable") {
        await db.autorole.update({ autorole: null }, { where: { server: msg.channel.guild.id } });
        await msg.reply(lang.autoroleDisableSuccess);
      } else {
        const role = msg.channel.guild.roles.find(r => r.id == roleID || r.name == roleID);
        if (!role) return msg.reply(lang.invalidRoleID);
        if (msg.guild.me.highestRole.position <= role.position) {
          return msg.reply(lang.autoroleRoleHigher);
        }

        await db.autorole.update({ autorole: role.id }, { where: { server: msg.channel.guild.id } });
        await msg.reply(lang.autoroleSuccess(role.name));
      }
    }
  }
}
