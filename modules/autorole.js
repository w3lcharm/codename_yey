module.exports = async member => {
	const dbItem = await settings.findOne({ where: { server: member.guild.id } });

	if (dbItem) {
		if (!dbItem.autorole) return;
		if (member.guild.me.hasPermission("MANAGE_ROLES"))
			await member.roles.add(dbItem.autorole);
	}
}
