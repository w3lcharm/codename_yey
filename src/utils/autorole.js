module.exports = async (client, guild, member) => {
	const dbItem = await autorole.findOne({ where: { server: member.guild.id } });
	if (dbItem) {
		if (!dbItem.autorole) return;
		if (member.guild.members.get(client.user.id).permission.has("manageRoles"))
			await member.addRole(dbItem.autorole);
	}
}
