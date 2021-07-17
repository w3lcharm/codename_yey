const Eris = require("eris");
const Sequelize = require("sequelize");
const package = require("../../package");
const moment = require("moment");
const os = require("os");

module.exports = {
  name: "stats",
  group: "general",
  description: "statsDescription",
  async run(client, msg, args, prefix) {
    const uptime = process.uptime();
    const uptimeDays = Math.floor(uptime / 86400);
    const parsedUptime = uptimeDays + moment.utc(uptime * 1000).format(":HH:mm:ss");

    const ramUsed = process.memoryUsage().heapUsed / 1048576;

    const cpu = os.cpus()[0];

    const embed = {
      title: msg.t("statsTitle"),
      color: await msg.author.embColor(),
      fields: [
        {
          name: msg.t("statsUptime"),
          value: parsedUptime,
        },
        {
          name: msg.t("statsServers"),
          value: client.guilds.size,
          inline: true,
        },
        {
          name: msg.t("statsUsers"),
          value: client.users.size,
          inline: true,
        },
        {
          name: msg.t("statsChannels"),
          value: Object.keys(client.channelGuildMap).length,
          inline: true,
        },
        {
          name: msg.t("statsVoiceConnections"),
          value: client.lavalinkManager ? client.lavalinkManager.players.size : "N/A",
          inline: true,
        },
        {
          name: msg.t("statsCommandsUsed"),
          value: client.usageCount,
          inline: true,
        },
        {
          name: msg.t("statsPlatform"),
          value: process.platform,
          inline: true,
        },
        {
          name: msg.t("statsVersions"),
          value: `**Node.js**: ${process.version}\n` +
            `**Eris**: ${Eris.VERSION}\n` +
            `**Sequelize**: ${Sequelize.version}\n` +
            `**Moment.js**: ${moment.version}`,
          inline: true,
        },
        {
          name: msg.t("statsRamUsed"),
          value: `${ramUsed.toFixed(1)} MB`,
          inline: true,
        },
        {
          name: msg.t("statsCpu"),
          value: `\`${cpu ? cpu.model : msg.t("cantGetCpuInfo")}\``,
        },
      ],
      footer: {
        text: `codename_yey v${package.version}`,
        icon_url: client.user.avatarURL,
      },
    };
    await msg.reply({ embed: embed });
  }
};
