const { DiscordRESTError } = require("eris");

module.exports = {
  name: "unban",
  group: "moderationGroup",
  description: "unbanDescription",
  usage: "unbanUsage",
  requiredPermissions: "banMembers",
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    }

    const userID = args[0];

    try {
      await msg.guild.unbanMember(userID);

      const user = client.users.get(userID) || await client.fetchUser(userID);

      const embed = {
        author: {
          name: lang.unbanSuccess(user.tag),
          icon_url: user.avatarURL,
        },
        color: 3066993,
        timestamp: new Date().toISOString(),
      };

      await msg.channel.createMessage({ embed });
    } catch (error) {
      let description;

      if (!msg.guild.me.permissions.has("banMembers")) {
        description = lang.botDontHavePerms(lang.permissions.banMembers);
      } else if (error instanceof DiscordRESTError) {
        description = lang.unbanInvalidUser;
      } else {
        throw error;
      }

      const embed = {
        title: lang.unbanFail,
        description,
        color: 15158332,
      };

      await msg.channel.createMessage({ embed });
    }
  }
}
