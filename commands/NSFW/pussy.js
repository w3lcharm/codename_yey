const NSFW = require("discord-nsfw");

module.exports = {
  name: "pussy",
  group: "nsfwGroup",
  description: "pussyDescription",
  async run(client, msg, args, prefix) {
    if (!msg.channel.nsfw) {
      return msg.reply(msg.t("notNsfwChannel"));
    }

    try {
      const image = await new NSFW().pussy();

      const embed = {
        color: await msg.author.embColor(),
        image: { url: image },
        footer: {
          text: msg.t("usedBy", msg.author.tag),
          icon_url: msg.author.avatarURL, 
        },
      };

      await msg.reply({ embed });
    } catch {
      return msg.reply(msg.t("hentaiRatelimit"));
    }
  }
}