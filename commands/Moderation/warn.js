const PermissionError = require("../../core/errors/PermissionError");
const ReactionHandler = require("../../core/ReactionHandler");

module.exports = {
  name: "warn",
  group: "moderation",
  description: "warnDescription",
  guildOnly: true,
  usage: "warnUsage",
  argsRequired: true,
  async run(client, msg, args, prefix) {
    if (!args.length)
      return msg.reply(msg.t("commandUsage", prefix, this));

    if (args[0] == "--list" || args[0] == "-l") {
      let member;
      if (!args[1]) member = msg.member;
      else member = msg.mentions.length ? 
        msg.guild.members.get(msg.mentions[0].id) :
        msg.guild.members.find(m => m.id === args[1] || m.tag === args[1]);
        
      if (!member) return msg.reply(msg.t("cantFindUser"));

      let embed = {
        author: {
          name: `${member.username}#${member.discriminator}`,
          icon_url: member.avatarURL,
        },
        color: Math.round(Math.random() * 16777216) + 1,
        fields: [],
      };
        
      const warnList = await db.warns.findAll({
        where: {
          server: msg.guild.id,
          user: member.user.id,
        },
      });
      let warnsLength = warnList.length;
      let pages = [];
      if (warnList.length > 10) {
        while (warnList.length) {
          const arr = [];

          for (let item of warnList.splice(0, 10)) {
            arr.push({
              name: msg.t("warnListFieldName", item.id, await client.fetchUser(item.warnedBy)),
              value: msg.t("reason", item.reason),
            });
          }

          pages.push(arr);
        }

        embed.fields = pages[0];
        embed.footer = { text: msg.t("warnsFooter", warnsLength, pages.length, 1) };
      } else {
        for (let item of warnList) {
          embed.fields.push({
            name: msg.t("warnListFieldName", item.id, await client.fetchUser(item.warnedBy)),
            value: msg.t("reason", item.reason),
          });
        }
        embed.footer = { text: msg.t("totalWarns", warnList.length) };
      }
      const message = await msg.reply({ embed });
      if (warnsLength > 10) {
        await message.addReaction("◀️");
        await message.addReaction("▶️");

        let pageNumber = 0;

        const reactionHandler = new ReactionHandler(message, u => u === msg.author.id, 600000);
        reactionHandler.on("reaction", (msg, emoji) => {
          switch (emoji.name) {
            case "◀️": 
              if (pageNumber === 0) return;
              pageNumber--;
              break;
            case "▶️":
              if (pageNumber === (pages.length - 1)) return;
              pageNumber++;
              break;
            default: return;
          }
          
          const page = pages[pageNumber];
          const embed = msg.embeds[0];
          embed.fields = page;
          embed.footer.text = msg.t("warnsFooter", warnsLength, pages.length, pageNumber + 1);
          message.edit({ embed });
        });
      }
      return;
    }

    if (msg.member.permission.has("kickMembers")) {
      if (args[0] == "--delete" || args[0] == "-d") {
        let id = args[1];
        if (!id) {
          return msg.reply(msg.t("warnIDNotProvided"));
        }
        const warn = await db.warns.findOne({
          where: {
            server: msg.guild.id,
            id: id,
          },
        });
        if (!warn) msg.reply(msg.t("invalidID"));
        else if (warn.server != msg.guild.id)
          msg.reply(msg.t("warnOnAnotherServer"));
        else {
          await db.warns.destroy({ where: { id: id } });
          msg.reply(msg.t("warnDeleteSuccess", warn.id));
        }
        return;
      }

      const userID = args.shift();
      const reason = args.join(" ");
      const member = msg.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") || msg.guild.members.find(m => m.tag === userID || m.id === userID);

      if (!member) return;
      if (member.id == msg.author.id)
        return msg.reply(msg.t("cantWarnYourself"));
      if (member.id == client.user.id)
        return msg.reply(msg.t("cantWarnBot"));
      if (msg.member.highestRole.position <= member.highestRole.position)
        return msg.reply(msg.t("cantWarnAdmin"));

      const warnObj = await db.warns.create({
        server: msg.guild.id,
        user: member.id,
        warnedBy: msg.author.id,
        reason: reason,
      });

      const embed = {
        author: {
          name: msg.t("warnSuccess", member),
          icon_url: member.avatarURL,
        },
        description: msg.t("reason", reason),
        color: 0x57f287,
        timestamp: new Date().toISOString(),
        footer: { text: msg.t("warnID", warnObj.id) },
      };
      await msg.reply({ embed });

      const { channel: modlogChannel } = await db.modlogs.findOrCreate({ where: { server: msg.guild.id } })
        .then(i => i[0]);
      try {
        const modlogEmbed = {
          author: {
            name: `${member.tag} has been warned`,
            icon_url: member.avatarURL,
          },
          fields: [
            {
              name: "Reason",
              value: reason,
            },
            {
              name: "Warned by:",
              value: msg.author.tag,
              inline: true,
            },
            {
              name: "Warn ID:",
              value: warnObj.id,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
        };

        await client.createMessage(modlogChannel, { embed: modlogEmbed });
      } catch {}
    } else {
      throw new PermissionError("missing permission", "kickMembers");
    }
  }
};
