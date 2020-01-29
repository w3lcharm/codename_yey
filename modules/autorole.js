function autorole(client, member) {
    client.db.get("select * from settings where server = ?", member.guild.id, async (err, row) => {
        if (!row || !row.autorole) return;
        if (member.guild.me.hasPermission("MANAGE_ROLES"))
            member.roles.add(row.autorole);
    });
}

module.exports = autorole;
