const { CategoryChannel, TextChannel, VoiceChannel } = require("eris");
const moment = require("moment");

module.exports = {
  name: "server",
  group: "basicGroup",
  description: "serverDescription",
  guildOnly: true,
  aliases: [ "s", "serverinfo" ],
  async run(client, msg, args, prefix, lang) {
    moment.locale(lang.langName);
    
    let owner = msg.guild.members.get(msg.guild.ownerID)
      || await client.fetchUser(msg.guild.ownerID);

    const createdDaysAgo = Math.floor((Date.now() - msg.guild.createdAt) / (1000 * 86400));

    const embed = {
      author: {
        name: msg.guild.name,
        icon_url: msg.guild.iconURL,
      },
      color: Math.round(Math.random() * 16777216) + 1,
      fields: [
        {
          name: lang.serverOwner,
          value: `${owner.tag} (<@${msg.guild.ownerID}>)`,
        },
        {
          name: "ID:",
          value: msg.guild.id,
        },
        {
          name: lang.serverRegion,
          value: msg.guild.region,
        },
        {
          name: lang.serverMembers,
          value: `**${lang.serverMembersTotal}** - ${msg.guild.memberCount}\n` +
            `**${lang.serverMembersBots}** - ${msg.guild.members.filter(m => m.bot).length}`,
        },
        {
          name: lang.serverChannels,
          value: `**${lang.serverChannelsCategories}** - ${msg.guild.channels.filter(c => c instanceof CategoryChannel).length}\n` +
            `**${lang.serverChannelsText}** - ${msg.guild.channels.filter(c => c instanceof TextChannel).length}\n` +
            `**${lang.serverChannelsVoice}** - ${msg.guild.channels.filter(c => c instanceof VoiceChannel).length}`,
        },
        {
          name: lang.serverEmojis,
          value: `**${lang.serverEmojisStatic}** - ${msg.guild.emojis.filter(e => !e.animated).length}\n` +
            `**${lang.serverEmojisAnimated}** - ${msg.guild.emojis.filter(e => e.animated).length}`,
        },
        {
          name: lang.serverVerificationLevel,
          value: lang.verificationLevel[msg.guild.verificationLevel],
        },
        {
          name: lang.serverTotalRoles,
          value: msg.guild.roles.size, 
        },
        {
          name: lang.serverCreatedAt,
          value: `${moment(msg.guild.createdAt).format("lll")} ${lang.daysAgo(createdDaysAgo)}`,
        },
      ]
    };

    await msg.channel.createMessage({ embed });
  }
};
