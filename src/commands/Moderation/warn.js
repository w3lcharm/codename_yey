const PermissionError = require("../../errors/permissionError");

module.exports = {
  name: "warn",
  group: "moderationGroup",
  description: "warnDescription",
  guildOnly: true,
  usage: "warnUsage",
  async run(client, msg, args, prefix, lang) {
    if (!args.length)
      return msg.channel.createMessage(lang.commandUsage(prefix, this));

    if (args[0] == "--list" || args[0] == "-l") {
      let member;
      if (!args[1]) member = msg.member;
      else member = msg.mentions.length ? 
        msg.guild.members.get(msg.mentions[0]) :
        msg.guild.members.find(m => m.id === args[1] || m.tag === args[1]);
        
      if (!member) return msg.channel.createMessage(lang.cantFindUser);

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
      for (let warn of warnList)
        embed.fields.push({
          name: `ID: ${warn.id}`,
          value: lang.reason(warn.reason),
        });
      embed.footer = { text: lang.totalWarns(warnList.length) };
      await msg.channel.createMessage({ embed });
      return;
    }

    if (msg.member.permission.has("kickMembers")) {
      if (args[0] == "--delete" || args[0] == "-d") {
        let id = args[1];
        const warn = await db.warns.findOne({
          where: {
            server: msg.guild.id,
            id: id,
          },
        });
        if (!warn) msg.channel.createMessage(lang.invalidID);
        else if (warn.server != msg.guild.id)
          msg.channel.createMessage(lang.warnOnAnotherServer);
        else {
          await db.warns.destroy({ where: { id: id } });
          msg.channel.createMessage(lang.warnDeleteSuccess(warn.id));
        }
        return;
      }

      const userID = args.shift();
      const reason = args.join(" ");
      const member = msg.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") || msg.guild.members.find(m => m.tag === userID || m.id === userID);

      if (!member) return;
      if (member.id == msg.author.id)
        return msg.channel.createMessage(lang.cantWarnYourself);
      if (member.id == client.user.id)
        return msg.channel.createMessage(lang.cantWarnBot);
      if (msg.member.highestRole.position < member.highestRole.position)
        return msg.channel.createMessage(lang.cantWarnAdmin);

      const warnObj = await db.warns.create({
        server: msg.guild.id,
        user: member.id,
        warnedBy: msg.author.id,
        reason: reason,
      });

      const embed = {
        author: {
          name: lang.warnSuccess(member),
          icon_url: member.avatarURL,
        },
        description: lang.reason(reason),
        color: 3066993,
        timestamp: new Date().toISOString(),
        footer: { text: lang.warnID(warnObj.id) },
      };
      await msg.channel.createMessage({ embed: embed });
    } else
      throw new PermissionError("missing permission", "kickMembers");
  }
};
