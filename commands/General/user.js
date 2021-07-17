const moment = require("moment");
const { Constants: { UserFlags } } = require("eris");
const formatDays = require("../../utils/formatDays");

const badgeEmojis = {
  DISCORD_EMPLOYEE: "<:discordEmployee:772878638114144296>",
  DISCORD_PARTNER: "<:partneredServerOwner:772878678753411082>",
  HYPESQUAD_EVENTS: "<:hypesquadEvents:772878658108522556>",
  BUG_HUNTER_LEVEL_1: "<:bugHunterLvl1:772878567646167091>",
  HOUSE_BRAVERY: "<:hypesquadBravery:772878523848589342>",
  HOUSE_BRILLIANCE: "<:hypesquadBrilliance:772878504743665704>",
  HOUSE_BALANCE: "<:hypesquadBalance:772878476704743466>",
  EARLY_SUPPORTER: "<:earlySupporter:772878612789329992>",
  BUG_HUNTER_LEVEL_2: "<:bugHunterLvl2:772878547521110038>",
  VERIFIED_BOT_DEVELOPER: "<:earlyVerifiedBotDev:772878588931997727>",
  //  VERIFIED_BOT: "<:verifiedBot:789014772166819851>",
  //  BOT: "<:bot:789016267138400266>",
};

function getUserBadges(user) {
  const badges = [];

  for (const flag in UserFlags) {
    if (!!(user.publicFlags & UserFlags[flag])) {
      badges.push(badgeEmojis[flag]);
    }
  }

  return badges;
}

module.exports = {
  name: "user",
  group: "general",
  description: "userDescription",
  usage: "userUsage",
  guildOnly: true,
  aliases: [ "u", "userinfo" ],
  async run(client, msg, args, prefix) {
    moment.locale(msg.t("langName"));

    let member;
    let userID = args.raw.join(" ");
    if (!userID) member = msg.member;
    else member = msg.guild.members.get(msg.mentions.length ? msg.mentions[0].id : "") ||
      msg.guild.members.find(m =>
        m.tag.toLowerCase().startsWith(userID.toLowerCase()) ||
        (m.nick && m.nick.toLowerCase().startsWith(userID.toLowerCase())) ||
        m.id == userID
      ) || client.users.find(u => u.tag == userID) || await client.fetchUser(userID);

    if (!member || userID == "@me") {
      return msg.reply(msg.t("cantFindUser"));
    }

    let name = `${member.username}#${member.discriminator}`;
    if (member.nick) name += ` (${member.nick})`;

    const createdDaysAgo = Math.floor((Date.now() - member.createdAt) / (1000 * 86400));
    const joinedDaysAgo = Math.floor((Date.now() - member.joinedAt) / (1000 * 86400));
    
    const badges = getUserBadges(member);

    const joinPos = member.joinedAt ? msg.guild.members.map(m => m.joinedAt)
      .sort((a, b) => a - b).indexOf(member.joinedAt) + 1 : 0;

    const embed = {
      author: {
        name,
        icon_url: member.avatarURL,
      },
      description: badges.join(" "),
      color: member.color || await msg.author.embColor(),
      fields: [
        {
          name: "ID:",
          value: member.id,
        },
        {
          name: msg.t("userRegisteredAt"),
          value: `<t:${Math.floor(member.createdAt / 1000)}> (${formatDays(createdDaysAgo, msg.t("langName"))})`,
        },
      ],
      footer: { text: joinPos ? msg.t("userJoinPosition", joinPos) : msg.t("userNotInServer") },
    };

    if (member.joinedAt) embed.fields.push({
      name: msg.t("userJoinedAt"),
      value: `<t:${Math.floor(member.joinedAt / 1000)}> (${formatDays(joinedDaysAgo, msg.t("langName"))})`,
    });

    if (member.roles && member.roles.length) embed.fields.push({
      name: msg.t("userRoles"),
      value: member.roleObjects.sort((a, b) => b.position - a.position)
        .map(r => r.mention).join(", "),
    });

    if (member.voiceState && member.voiceState.channelID) embed.fields.push({
      name: msg.t("userVoiceChannel"),
      value: `<#${member.voiceState.channelID}>`,
    });

    await msg.reply({ embed: embed });
  }
};
