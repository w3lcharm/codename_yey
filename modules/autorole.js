function autorole(client, member) {
    client.db.get("select * from autorole where server = ?", member.guild.id, async (err, row) => {
        if (!row || !row.role) return;
        if (member.guild.me.hasPermission("MANAGE_ROLES"))
            await member.addRole(row.role);
    });
}

module.exports = autorole;