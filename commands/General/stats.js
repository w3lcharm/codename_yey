const Eris = require("eris");
const Sequelize = require("sequelize");
const package = require("../../package");
const moment = require("moment");
const os = require("os");

module.exports = {
  name: "stats",
  group: "generalGroup",
  description: "statsDescription",
  async run(client, msg, args, prefix, lang) {
    const uptime = process.uptime();
    const uptimeDays = Math.floor(uptime / 86400);
    const parsedUptime = uptimeDays + moment.utc(uptime * 1000).format(":HH:mm:ss");

    const ramUsed = process.memoryUsage().heapUsed / 1048576;

    const cpu = os.cpus()[0];

    const embed = {
      title: lang.statsTitle,
      color: await msg.author.embColor(),
      fields: [
        {
          name: lang.statsUptime,
          value: parsedUptime,
        },
        {
          name: lang.statsServers,
          value: client.guilds.size,
          inline: true,
        },
        {
          name: lang.statsUsers,
          value: client.users.size,
          inline: true,
        },
        {
          name: lang.statsChannels,
          value: Object.keys(client.channelGuildMap).length,
          inline: true,
        },
        {
          name: lang.statsVoiceConnections,
          value: client.lavalinkManager ? client.lavalinkManager.players.size : "N/A",
          inline: true,
        },
        {
          name: lang.statsCommandsUsed,
          value: client.usageCount,
          inline: true,
        },
        {
          name: lang.statsPlatform,
          value: process.platform,
          inline: true,
        },
        {
          name: lang.statsVersions,
          value: `**Node.js**: ${process.version}\n` +
            `**Eris**: ${Eris.VERSION}\n` +
            `**Sequelize**: ${Sequelize.version}\n` +
            `**Moment.js**: ${moment.version}`,
          inline: true,
        },
        {
          name: lang.statsRamUsed,
          value: `${ramUsed.toFixed(1)} MB`,
          inline: true,
        },
        {
          name: lang.statsCpu,
          value: `\`${cpu ? cpu.model : lang.cantGetCpuInfo}\``,
        },
      ],
      footer: {
        text: `codename_yey v${package.version}`,
        icon_url: client.user.avatarURL,
      },
    };
    await msg.channel.createMessage({ embed: embed });
  }
};
