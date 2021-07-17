const moment = require("moment");
const formatDays = require("../../utils/formatDays");
const intToHex = require("../../utils/intToHex");

module.exports = {
  name: "role",
  group: "general",
  description: "roleDescription",
  usage: "roleUsage",
  guildOnly: true,
  argsRequired: true,
  aliases: [ "r", "roleinfo" ],
  async run(client, msg, args, prefix) {
    if (!args.length) {
      return msg.reply(msg.t("commandUsage", prefix, this));
    }

    let roleID = args.raw.join(" ");

    if (roleID && roleID.startsWith("<@&")) {
      roleID = roleID.replace("<@&", "").replace(">", "");
    }

    const role = msg.guild.roles.find(r => r.name.toLowerCase().startsWith(roleID) || r.id === roleID);

    if (!role) {
      return msg.reply(msg.t("roleNotFound"));
    }

    moment.locale(msg.t("langName"));

    const createdDaysAgo = Math.floor((Date.now() - role.createdAt) / (86400 * 1000));

    const embed = {
      title: role.name,
      color: role.color || null,
      fields: [
        {
          name: "ID:",
          value: role.id,
        },
        {
          name: msg.t("roleMembers"),
          value: msg.guild.members.filter(m => m.roles.includes(role.id)).length,
        },
        {
          name: msg.t("roleColor"),
          value: role.color ? intToHex(role.color) : msg.t("roleDefaultColor"),
        },
        {
          name: msg.t("roleMentionable"),
          value: msg.t("yesNo", role.mentionable),
        },
        {
          name: msg.t("roleHoisted"),
          value: msg.t("yesNo", role.hoist),
        },
        {
          name: msg.t("roleManaged"),
          value: msg.t("yesNo", role.managed),
        },
        {
          name: msg.t("roleCreatedAt"),
          value: `${moment(role.createdAt).format("lll")} (${formatDays(createdDaysAgo, msg.t("langName"))})`,
        },
      ],
    };

    await msg.reply({ embed });
  }
}
