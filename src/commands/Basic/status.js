const { VERSION } = require("eris");

function parseUptime(time) {
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
}

module.exports = {
  name: "status",
  group: "basicGroup",
  description: "statusDescription",
  async run(client, msg, args, prefix, lang) {
    const embed = {
      title: lang.statusTitle,
      color: Math.round(Math.random() * 16777216) + 1,
      fields: [
        {
          name: lang.statusUptime,
          value: parseUptime(process.uptime()),
        },
        {
          name: lang.statusServers,
          value: client.guilds.size,
        },
        {
          name: lang.statusUsers,
          value: client.users.size,
        },
        {
          name: lang.statusPlatform,
          value: process.platform,
        },
        {
          name: lang.statusVersions,
          value: `**Node.js**: ${process.version}\n` +
            `**Eris**: ${VERSION}`,
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
