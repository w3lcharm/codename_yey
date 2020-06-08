module.exports = {
  name: "hackban",
  group: "moderationGroup",
  description: "hackbanDescription",
  usage: "hackbanUsage",
  requiredPermissions: "banMembers",
  async run(client, msg, args, prefix, lang) {
    if (!args.length)
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    
    const userID = args.shift();
    const reason = args.join(" ");

    try {
      if (userID === msg.author.id)
        return msg.channel.createMessage(lang.cantBanYourself);
      if (userID === client.user.id)
        return msg.channel.createMessage(lang.cantBanBot);
      
      await msg.channel.guild.banMember(userID, 0, reason);

      const embed = {
        title: lang.hackbanSuccess(userID),
        description: lang.reason(reason),
        color: 3066993,
        timestamp: new Date().toISOString(),
      };
      await msg.channel.createMessage({ embed });
    } catch (err) {
      let description;
      if (!msg.channel.guild.members.get(client.user.id).permission.has("banMembers"))
        description = lang.botDontHavePerms(lang.permissions.banMembers);
      else description = lang.somethingWentWrong;

      const embed = {
        title: lang.hackbanFail,
        description,
        color: 15158332,
      };
      await msg.channel.createMessage({ embed });
    }
  }
}
