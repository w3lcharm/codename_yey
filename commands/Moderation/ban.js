module.exports = {
  name: "ban",
  group: "moderation",
  description: "banDescription",
  requiredPermissions: "banMembers",
  guildOnly: true,
  argsRequired: true,
  usage: "banUsage",
  async run(client, msg, args, prefix) {
    if (!args.length)
      return msg.reply(msg.t("commandUsage", prefix, this));

    const userID = args.shift();
    const reason = args.join(" ");

    const member = msg.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") || msg.guild.members.find(m => m.id === userID || m.tag === userID);

    if (!member) {
      return msg.reply(msg.t("cantFindUser"));
    };

    if (member.bannable && member.highestRole.position < msg.member.highestRole.position) {
      if (member.id === msg.author.id)
        return msg.reply(msg.t("cantBanYourself"));
      if (member.id === client.user.id)
        return msg.reply(msg.t("cantBanBot"));

      await member.ban(0, encodeURI(`${reason} (banned by ${msg.author.username}#${msg.author.discriminator})`));

      const embed = {
        author: {
          name: msg.t("banSuccess", member),
          icon_url: member.avatarURL,
        },
        description: msg.t("reason", reason),
        color: 0x57f287,
        timestamp: new Date().toISOString(),
      };
        
      await msg.reply({ embed });
    } else {
      let description;
      if (!msg.guild.me.permission.has("banMembers")) {
        description = msg.t("botDontHavePerms", msg.t("permissions").banMembers);
      } else if (member.id === msg.guild.ownerID) {
        description = msg.t("userIsOwner");
      } else if (member.highestRole.position >= msg.guild.me.highestRole.position) {
        description = msg.t("roleHigher");
      } else if (member.highestRole.position >= msg.member.highestRole.position) {
        description = msg.t("memberRoleHigher");
      }

      const embed = {
        title: msg.t("banFail"),
        description,
        color: 0xed4245,
      };
      await msg.reply({ embed });
    }
  }
};
