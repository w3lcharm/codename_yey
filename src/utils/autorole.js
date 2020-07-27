async function autorole(guild, member) {
  if (member.bot) return;

  const dbItem = await db.autorole.findOne({ where: { server: member.guild.id } });
  if (dbItem) {
    if (!dbItem.autorole) return;
    if (member.guild.me.permission.has("manageRoles")) {
      await member.addRole(dbItem.autorole);
    }
  }
}

module.exports.load = function load() {
  client.on("guildMemberAdd", autorole);
}

module.exports.unload = function unload() {
  client.off("guildMemberAdd", autorole)
}
