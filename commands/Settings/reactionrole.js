const emojiRegex = require("emoji-regex");

module.exports = {
  name: "reactionrole",
  group: "settingsGroup",
  description: "reactionroleDescription",
  usage: "reactionroleUsage",
  aliases: [ "rr" ],
  argsRequired: true,
  requiredPermissions: "manageGuild",
  async run(client, msg, args, prefix) {
    const [ msgID, emoji, roleID ] = args;
    console.log(emoji);

    const reactionRoles = await db.reactionRoles.findAll({
      where: {
        channel: msg.channel.id,
        message: msgID,
      },
    });

    if (!emoji && !roleID) {
      const embed = {
        title: msg.t("reactionRoles"),
        description: reactionRoles.map(r => `${r.emojiID ? `<:${r.emojiName}:${r.emojiID}>` : r.emojiName} - <@&${r.role}>`).join("\n"),
        color: await msg.author.embColor(),
      };
      
      await msg.reply({ embed });
    } else {
      if (reactionRoles.length >= 20) {
        return msg.reply(msg.t("tooMoreReactionRoles"));
      }

      const regex = emojiRegex();

      if (!/<a:.+?:\d+>|<:.+?:\d+>/g.test(emoji) && !regex.test(emoji)) {
        return msg.reply(msg.t("invalidEmoji"));
      }

      if (!roleID) {
        return msg.reply(msg.t("noRoleProvided"));
      }

      const emojiName = emoji.match(regex) ? emoji.match(regex)[0] : emoji.match(/(?<=:)\w+?(?=:)/)[0];
      const emojiID = emoji.match(/(?<=:)\d+/g) ? emoji.match(/(?<=:)\d+/g)[0] : null;

      if (roleID == "disable") {
        const reactionRole = await db.reactionRoles.findOne({
          where: {
            channel: msg.channel.id,
            message: msgID,
            emojiName,
            emojiID,
          },
        });

        if (!reactionRole) {
          return msg.reply(msg.t("reactionRoleDoesNotExist"));
        }

        await reactionRole.destroy();
        return msg.reply(msg.t("reactionRoleDeleteSuccess"));
      }

      const role = msg.guild.roles.find(r => r.id == roleID || r.name == roleID || r.mention == roleID);
      if (!role) {
        return msg.reply(msg.t("invalidRoleProvided"));
      }

      if (role.position >= msg.guild.me.highestRole.position) {
        return msg.reply(msg.t("providedRoleHigher"));
      }

      if (!msg.guild.me.permissions.has("manageRoles")) {
        return msg.reply(msg.t("reactionRoleDontHavePerms"));
      }

      let reactionRole = await db.reactionRoles.findOrCreate({
        where: {
          channel: msg.channel.id,
          message: msgID,
          emojiName,
          emojiID,
        },
      }).then(r => r[0]);

      await reactionRole.update({ role: role.id });

      await msg.reply(msg.t("reactionRoleSuccess", emoji, role.name));
    }
  }
}