module.exports = {
  name: "unmute",
  group: "moderation",
  description: "unmuteDescription",
  usage: "unmuteUsage",
  requiredPermissions: "kickMembers",
  argsRequired: true,
  async run(client, msg, args, prefix) {
    if (!args.length)
      return msg.reply(msg.t("commandUsage", prefix, this));

    const userID = args[0];
    const member = msg.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") ||
      msg.guild.members.find(m => m.id == userID || m.tag == userID);

    if (!member) {
      return msg.reply(msg.t("cantFindUser"));
    };

    try {
      let mutedRole = msg.guild.roles.find(r => r.name === "Muted");
      if (!mutedRole) {
        mutedRole = await msg.guild.createRole({
          name: "Muted",
          mentionable: false,
        });

        for (const channel of msg.guild.channels.values()) {
          try {
            await channel.editPermission(mutedRole.id, 0, 6144, "role");
          } catch {}
        }
      }

      if (!member.roles.includes(mutedRole.id))
        return msg.reply(msg.t("userNotMuted"));

      await member.removeRole(mutedRole.id, "unmute");

      const embed = {
        author: {
          name: msg.t("unmuteSuccess", member),
          icon_url: member.avatarURL,
        },
        color: 0x57f287,
        timestamp: new Date().toISOString(),
      };

      await msg.reply({ embed });
      if (muteTimers.has(msg.guild.id)) {
        if (!muteTimers.get(msg.guild.id).has(member.id)) return;
        clearTimeout(muteTimers.get(msg.guild.id).get(member.id));
        muteTimers.get(msg.guild.id).delete(member.id);
      }  
    } catch (err) {
      let description;
      if (!msg.guild.members.get(client.user.id).permission.has("manageRoles"))
        description = msg.t("botDontHavePerms", msg.t("permissions").banMembers);
      else if (member.id === msg.guild.ownerID)
        description = msg.t("userIsOwner");
      else if (member.highestRole.position >= msg.guild.members.get(client.user.id).highestRole.position)
        description = msg.t("roleHigher");
      else {
        description = msg.t("somethingWentWrong");
        client.emit("commandError", this.name, msg, err, false);
      }

      const embed = {
        title: lang.unmuteFail,
        description,
        color: 0xed4245,
      };
      await msg.reply({ embed });
    }
  }
};
