const { stripIndents } = require("common-tags");

module.exports = {
  name: "info",
  group: "generalGroup",
  description: "infoDescription",
  async run(client, msg, args, prefix) {
    const inviteLink = await client.getInviteLink(8);

    const embed = {
      author: {
        name: "codename_yey",
        icon_url: client.user.avatarURL,
      },
      description: msg.t("infoDesc"),
      color: await msg.author.embColor(),
      fields: [
        {
          name: msg.t("infoDeveloper"),
          value: client.users.get("412503784455929857").tag,
        },
        {
          name: msg.t("infoLinks"),
          value: stripIndents`[${msg.t("infoBotInvite")}](${inviteLink})
            [${msg.t("infoSupportServer")}](https://discord.gg/dHamqUhPpA)
            [${msg.t("infoDonate")}](https://www.donationalerts.com/r/codename_yey)
            [top.gg](https://top.gg/bot/641312878804074497)
            [discord.bots.gg](https://discord.bots.gg/bots/641312878804074497)
            [bots.server-discord.com](https://bots.server-discord.com/641312878804074497)
            [boticord.top](https://boticord.top/bot/641312878804074497)`,
        },
      ],
    };

    await msg.reply({ embed });
  }
}
