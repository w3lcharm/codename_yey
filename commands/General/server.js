const { CategoryChannel, TextChannel, VoiceChannel } = require("eris");
const moment = require("moment");

module.exports = {
  name: "server",
  group: "generalGroup",
  description: "serverDescription",
  guildOnly: true,
  aliases: [ "s", "serverinfo" ],
  async run(client, msg, args, prefix) {
    moment.locale(msg.t("langName"));

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
      color: await msg.author.embColor(),
      fields: [
        {
          name: msg.t("serverOwner"),
          value: `${owner.tag} (<@${guild.ownerID}>)`,
        },
        {
          name: "ID:",
          value: guild.id,
        },
        {
          name: msg.t("serverRegion"),
          value: guild.region,
        },
        {
          name: msg.t("serverMembers"),
          value: `**${msg.t("serverMembersTotal")}** - ${guild.memberCount}\n` +
            `**${msg.t("serverMembersBots")}** - ${guild.members.filter(m => m.bot).length}`,
          inline: true,
        },
        {
          name: msg.t("serverChannels"),
          value: `**${msg.t("serverChannelsCategories")}** - ${guild.channels.filter(c => c instanceof CategoryChannel).length}\n` +
            `**${msg.t("serverChannelsText")}** - ${guild.channels.filter(c => c instanceof TextChannel).length}\n` +
            `**${msg.t("serverChannelsVoice")}** - ${guild.channels.filter(c => c instanceof VoiceChannel).length}`,
          inline: true,
        },
        {
          name: msg.t("serverEmojis"),
          value: `**${msg.t("serverEmojisStatic")}** - ${guild.emojis.filter(e => !e.animated).length}\n` +
            `**${msg.t("serverEmojisAnimated")}** - ${guild.emojis.filter(e => e.animated).length}`,
          inline: true,
        },
        {
          name: msg.t("serverVerificationLevel"),
          value: msg.t("verificationLevel")[guild.verificationLevel],
        },
        {
          name: msg.t("serverTotalRoles"),
          value: guild.roles.size, 
        },
        {
          name: msg.t("serverBoostLevel"),
          value: guild.premiumTier,
          inline: true,
        },
        {
          name: msg.t("serverBoosts"),
          value: guild.premiumSubscriptionCount,
          inline: true,
        },
      ],
      footer: { text: msg.t("serverCreatedAt") },
      timestamp: new Date(guild.createdAt).toISOString(),
    };

    if (guild.features.length) embed.fields.push({
      name: msg.t("serverFeatures"),
      value: guild.features.map(f => `\`${msg.t("features")[f]}\``).join(", "),
    });

    await msg.reply({ embed });
  }
};
