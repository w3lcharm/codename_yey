const { stripIndents } = require("common-tags");

const inviteLink = "https://discord.com/api/oauth2/authorize?client_id=641312878804074497&permissions=8&scope=bot";

module.exports = {
  name: "info",
  group: "basicGroup",
  description: "infoDescription",
  async run(client, msg, args, prefix, lang) {
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
            [top.gg](https://top.gg/bot/641312878804074497)
            ${lang.infoDonate}`,
        },
      ],
    };

    await msg.channel.createMessage({ embed });
  }
}
