const { VERSION } = require("eris");
const moment = require("moment");

module.exports = {
  name: "stats",
  group: "basicGroup",
  description: "statsDescription",
  async run(client, msg, args, prefix, lang) {
    const uptime = process.uptime();
    const uptimeDays = Math.floor(uptime / 86400);
    const parsedUptime = uptimeDays + moment.utc(uptime * 1000).format(":HH:mm:ss");

    const ramUsed = process.memoryUsage().heapUsed / 1048576;

    const embed = {
      title: lang.statsTitle,
      color: Math.round(Math.random() * 16777216) + 1,
      fields: [
        {
          name: lang.statsUptime,
          value: parsedUptime,
        },
        {
          name: lang.statsServers,
          value: client.guilds.size,
        },
        {
          name: lang.statsUsers,
          value: client.users.size,
        },
        {
          name: lang.statsPlatform,
          value: process.platform,
        },
        {
          name: lang.statsVersions,
          value: `**${lang.statsBot}**: ${client.version}\n` +
            `**Node.js**: ${process.version}\n` +
            `**Eris**: ${VERSION}`,
        },
        {
          name: lang.statsRamUsed,
          value: `${ramUsed.toFixed(1)} MB`,
        },
      ],
      footer: {
        text: "codename_yey © 1z3ngero",
        icon_url: client.user.avatarURL,
      },
    };
    await msg.channel.createMessage({ embed: embed });
  }
};
