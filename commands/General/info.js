const { stripIndents } = require("common-tags");

module.exports = {
  name: "info",
  group: "generalGroup",
  description: "infoDescription",
  async run(client, msg, args, prefix, lang) {
    const inviteLink = await client.getInviteLink(8);

    const embed = {
      author: {
        name: "codename_yey",
        icon_url: client.user.avatarURL,
      },
      description: lang.infoDesc,
      color: Math.round(Math.random() * 16777216),
      fields: [
        {
          name: lang.infoDeveloper,
          value: client.users.get("412503784455929857").tag,
        },
        {
          name: lang.infoLinks,
          value: stripIndents`[${lang.infoBotInvite}](${inviteLink})
            [${lang.infoSupportServer}](https://discord.gg/bFqtTER)
            [${lang.infoDonate}](https://www.donationalerts.com/r/codename_yey)
            [${lang.infoGitHubRepo}](https://github.com/1z3ngero/codename_yey)
            [top.gg](https://top.gg/bot/641312878804074497)
            [discord.bots.gg](https://discord.bots.gg/bots/641312878804074497)
            [bots.server-discord.com](https://bots.server-discord.com/641312878804074497)
            [boticord.top](https://boticord.top/bot/641312878804074497)`,
        },
      ],
    };

    await msg.channel.createMessage({ embed });
  }
}
