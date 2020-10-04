module.exports = {
  name: "kick",
  group: "moderationGroup",
  description: "kickDescription",
  requiredPermissions: "kickMembers",
  guildOnly: true,
  usage: "kickUsage",
  async run(client, msg, args, prefix, lang) {
    if (!args.length)
      return msg.channel.createMessage(lang.commandUsage(prefix, this));

    const userID = args.shift();
    const reason = args.join(" ");

    const member = msg.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") || msg.guild.members.find(m => m.id === userID || m.tag == userID);

    if (!member) return;

    if (member.kickable && member.highestRole.position < msg.member.highestRole.position) {
      if (member.id === msg.author.id)
        return msg.channel.createMessage(lang.cantKickYourself);
      if (member.id === client.user.id)
        return msg.channel.createMessage(lang.cantKickBot);
      
      await member.kick(encodeURI(`${reason} (kicked by ${msg.author.username}#${msg.author.discriminator})`));

      const embed = {
        author: {
          name: lang.kickSuccess(member),
          icon_url: member.avatarURL,
        },
        description: lang.reason(reason),
        color: 3066993,
        timestamp: new Date().toISOString(),
      };
        
      await msg.channel.createMessage({ embed });
    } else {
      let description;
      if (!msg.guild.me.permission.has("kickMembers")) {
        description = lang.botDontHavePerms(lang.permissions.kickMembers);
      } else if (member.id === msg.guild.ownerID) {
        description = lang.userIsOwner;
      } else if (member.highestRole.position >= msg.guild.me.highestRole.position) {
        description = lang.roleHigher;
      } else if (member.highestRole.position >= msg.member.highestRole.position) {
        description = lang.memberRoleHigher;
      }

      const embed = {
        title: lang.kickFail,
        description,
        color: 15158332,
      };
      await msg.channel.createMessage({ embed });
    }
  }
};
