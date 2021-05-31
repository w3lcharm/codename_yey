const NSFW = require("discord-nsfw");

module.exports = {
  name: "hentai",
  group: "nsfwGroup",
  description: "hentaiDescription",
  async run(client, msg, args, prefix) {
    if (!msg.channel.nsfw) {
      return msg.reply(msg.t("notNsfwChannel"));
    }

    try {
      const image = await new NSFW().hentai();

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