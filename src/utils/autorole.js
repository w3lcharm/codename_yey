module.exports = async (client, guild, member) => {
  if (member.bot) return;

  const dbItem = await db.autorole.findOne({ where: { server: member.guild.id } });
  if (dbItem) {
    if (!dbItem.autorole) return;
    if (member.guild.members.get(client.user.id).permission.has("manageRoles"))
      await member.addRole(dbItem.autorole);
  }
}
