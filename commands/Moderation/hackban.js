module.exports = {
  name: "hackban",
  group: "moderationGroup",
  description: "hackbanDescription",
  usage: "hackbanUsage",
  requiredPermissions: "banMembers",
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length)
      return msg.reply(msg.t("commandUsage", prefix, this));
    
    const userID = args.shift();
    const reason = args.join(" ");

    try {
      if (userID === msg.author.id)
        return msg.reply(msg.t("cantBanYourself"));
      if (userID === client.user.id)
        return msg.reply(msg.t("cantBanBot"));
      
      await msg.channel.guild.banMember(userID, 0, encodeURI(reason));

      const embed = {
        title: msg.t("hackbanSuccess", userID),
        description: msg.t("reason", reason),
        color: 3066993,
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
        color: 15158332,
      };
      await msg.reply({ embed });
    }
  }
}
