const { DiscordRESTError } = require("eris");

module.exports = {
  name: "unban",
  group: "moderationGroup",
  description: "unbanDescription",
  usage: "unbanUsage",
  requiredPermissions: "banMembers",
  argsRequired: true,
  async run(client, msg, args, prefix) {
    if (!args.length) {
      return msg.reply(msg.t("commandUsage", prefix, this));
    }

    const userID = args[0];

    try {
      await msg.guild.unbanMember(userID);

      const user = client.users.get(userID) || await client.fetchUser(userID);

      const embed = {
        author: {
          name: msg.t("unbanSuccess", user.tag),
          icon_url: user.avatarURL,
        },
        color: 3066993,
        timestamp: new Date().toISOString(),
      };

      await msg.reply({ embed });
    } catch (error) {
      let description;

      if (!msg.guild.me.permissions.has("banMembers")) {
        description = msg.t("botDontHavePerms", msg.t("permissions").banMembers);
      } else if (error instanceof DiscordRESTError) {
        description = msg.t("unbanInvalidUser");
      } else {
        throw error;
      }

      const embed = {
        title: msg.t("unbanFail"),
        description,
        color: 15158332,
      };

      await msg.reply({ embed });
    }
  }
}
