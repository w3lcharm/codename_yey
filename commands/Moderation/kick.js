module.exports = {
  name: "kick",
  group: "moderationGroup",
  description: "kickDescription",
  requiredPermissions: "kickMembers",
  guildOnly: true,
  usage: "kickUsage",
  argsRequired: true,
  async run(client, msg, args, prefix) {
    if (!args.length)
      return msg.reply(msg.t("commandUsage", prefix, this));

    const userID = args.shift();
    const reason = args.join(" ");

    const member = msg.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") || msg.guild.members.find(m => m.id === userID || m.tag == userID);

    if (!member) {
      return msg.reply(msg.t("cantFindUser"));
    };

    if (member.kickable && member.highestRole.position < msg.member.highestRole.position) {
      if (member.id === msg.author.id)
        return msg.reply(msg.t("cantKickYourself"));
      if (member.id === client.user.id)
        return msg.reply(msg.t("cantKickBot"));
      
      await member.kick(encodeURI(`${reason} (kicked by ${msg.author.username}#${msg.author.discriminator})`));

      const embed = {
        author: {
          name: msg.t("kickSuccess", member),
          icon_url: member.avatarURL,
        },
        description: msg.t("reason", reason),
        color: 3066993,
        timestamp: new Date().toISOString(),
      };
        
      await msg.reply({ embed });
    } else {
      let description;
      if (!msg.guild.me.permission.has("kickMembers")) {
        description = lang.botDontHavePerms(lang.permissions.kickMembers);
      } else if (member.id === msg.guild.ownerID) {
        description = msg.t("userIsOwner");
      } else if (member.highestRole.position >= msg.guild.me.highestRole.position) {
        description = msg.t("roleHigher");
      } else if (member.highestRole.position >= msg.member.highestRole.position) {
        description = msg.t("memberRoleHigher");
      }

      const embed = {
        title: msg.t("kickFail"),
        description,
        color: 15158332,
      };
      await msg.reply({ embed });
    }
  }
};
