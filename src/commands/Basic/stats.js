const { VERSION } = require("eris");
const moment = require("moment");

/* function parseUptime(time) {
  const ms = Math.floor(time * 1000);
  const obj = new Date(ms);

  let days = obj.getUTCDate() - 1;
  let hours = obj.getUTCHours();
  let minutes = obj.getUTCMinutes();
  let seconds = obj.getUTCSeconds();

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  return `${days}:${hours}:${minutes}:${seconds}`;
} */

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
          value: `**Node.js**: ${process.version}\n` +
            `**Eris**: ${VERSION}`,
        },
        {
          name: lang.statsRamUsed,
          value: `${ramUsed.toFixed(1)} MB`,
        },
      ],
      footer: {
        text: "codename_yey © 1z3ngero, 2020",
        icon_url: client.user.avatarURL,
      },
    };
    await msg.channel.createMessage({ embed: embed });
  }
};
