module.exports = {
  name: "hackban",
  group: "moderation",
  description: "hackbanDescription",
  usage: "hackbanUsage",
  requiredPermissions: "banMembers",
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length)
      return msg.reply(msg.t("commandUsage", prefix, this));
    
    const userID = args.shift();
    const reason = args.join(" ");

    const user = await client.fetchUser(userID);
    if (!user) {
      return msg.reply(msg.t("hackbanUserNotFound"));
    }

    try {
      if (userID === msg.author.id) {
        return msg.reply(msg.t("cantBanYourself"));
      }
      if (userID === client.user.id) {
        return msg.reply(msg.t("cantBanBot"));
      }

      if (msg.guild.members.has(userID)) {
        return msg.reply(msg.t("hackbanUserAlreadyInServer"));
      }

      await msg.channel.guild.banMember(userID, 0, encodeURI(reason));

      const embed = {
        author: {
          name: msg.t("hackbanSuccess", user.tag),
          icon_url: user.avatarURL,
        },
        description: msg.t("reason", reason),
        color: 0x57f287,
        timestamp: new Date().toISOString(),
      };
      await msg.reply({ embed });
    } catch (err) {
      let description;
      if (!msg.channel.guild.members.get(client.user.id).permission.has("banMembers"))
        description = msg.t("botDontHavePerms", msg.t("permissions").banMembers);
      else description = msg.t("somethingWentWrong");

      const embed = {
        title: msg.t("hackbanFail"),
        description,
        color: 0xed4245,
      };
      await msg.reply({ embed });
    }
  }
}
