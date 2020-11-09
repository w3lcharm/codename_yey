const moment = require("moment");

function intToHex(num) {
  let hexStr = num.toString(16).toUpperCase();

  while (hexStr.length < 6) {
    hexStr = "0" + hexStr;
  }

  return `#${hexStr}`;
}

module.exports = {
  name: "role",
  group: "generalGroup",
  description: "roleDescription",
  usage: "roleUsage",
  guildOnly: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    }

    let roleID = msg.content.slice(prefix.length + this.name.length + 1);

    if (roleID && roleID.startsWith("<@&")) {
      roleID = roleID.replace("<@&", "").replace(">", "");
    }

    let role = msg.guild.roles.find(r => r.name === roleID || r.id === roleID);

    if (!role) {
      return msg.channel.createMessage(lang.roleNotFound);
    }

    moment.locale(lang.langName);

    let createdDaysAgo = Math.floor((Date.now() - role.createdAt) / (86400 * 1000));

    let embed = {
      title: role.name,
      color: role.color || null,
      fields: [
        {
          name: "ID:",
          value: role.id,
        }, 
        {
          name: lang.roleColor,
          value: role.color ? intToHex(role.color) : lang.roleDefaultColor,
        },
        {
          name: lang.roleMentionable,
          value: lang.yesNo(role.mentionable),
        },
        {
          name: lang.roleCreatedAt,
          value: `${moment(role.createdAt).format("lll")} ${lang.daysAgo(createdDaysAgo)}`,
        },
      ],
    };

    await msg.channel.createMessage({ embed });
  }
}
