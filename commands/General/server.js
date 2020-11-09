const { CategoryChannel, TextChannel, VoiceChannel } = require("eris");
const moment = require("moment");

module.exports = {
  name: "server",
  group: "generalGroup",
  description: "serverDescription",
  guildOnly: true,
  aliases: [ "s", "serverinfo" ],
  async run(client, msg, args, prefix, lang) {
    moment.locale(lang.langName);

    const guild = client.owners.includes(msg.author.id) ?
      client.guilds.get(args[0]) || msg.guild : msg.guild;
    
    let owner = guild.members.get(guild.ownerID)
      || await client.fetchUser(guild.ownerID);

    const createdDaysAgo = Math.floor((Date.now() - guild.createdAt) / (1000 * 86400));

    const embed = {
      author: {
        name: guild.name,
        icon_url: guild.iconURL,
      },
      color: Math.round(Math.random() * 16777216) + 1,
      fields: [
        {
          name: lang.serverOwner,
          value: `${owner.tag} (<@${guild.ownerID}>)`,
        },
        {
          name: "ID:",
          value: guild.id,
        },
        {
          name: lang.serverRegion,
          value: guild.region,
        },
        {
          name: lang.serverMembers,
          value: `**${lang.serverMembersTotal}** - ${guild.memberCount}\n` +
            `**${lang.serverMembersBots}** - ${guild.members.filter(m => m.bot).length}`,
        },
        {
          name: lang.serverChannels,
          value: `**${lang.serverChannelsCategories}** - ${guild.channels.filter(c => c instanceof CategoryChannel).length}\n` +
            `**${lang.serverChannelsText}** - ${guild.channels.filter(c => c instanceof TextChannel).length}\n` +
            `**${lang.serverChannelsVoice}** - ${guild.channels.filter(c => c instanceof VoiceChannel).length}`,
        },
        {
          name: lang.serverEmojis,
          value: `**${lang.serverEmojisStatic}** - ${guild.emojis.filter(e => !e.animated).length}\n` +
            `**${lang.serverEmojisAnimated}** - ${guild.emojis.filter(e => e.animated).length}`,
        },
        {
          name: lang.serverVerificationLevel,
          value: lang.verificationLevel[guild.verificationLevel],
        },
        {
          name: lang.serverTotalRoles,
          value: guild.roles.size, 
        },
        {
          name: lang.serverCreatedAt,
          value: `${moment(guild.createdAt).format("lll")} ${lang.daysAgo(createdDaysAgo)}`,
        },
      ]
    };

    await msg.channel.createMessage({ embed });
  }
};
