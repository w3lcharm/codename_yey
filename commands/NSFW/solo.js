const NSFW = require("discord-nsfw");

module.exports = {
  name: "solo",
  group: "nsfwGroup",
  description: "soloDescription",
  async run(client, msg, args, prefix) {
    if (!msg.channel.nsfw) {
      return msg.reply(msg.t("notNsfwChannel"));
    }

    try {
      const image = await new NSFW().solo();

      const embed = {
        color: await msg.author.embColor(),
        image: { url: image },
      };

      await msg.reply({ embed });
    } catch {
      return msg.reply(msg.t("hentaiRatelimit"));
    }
  }
}