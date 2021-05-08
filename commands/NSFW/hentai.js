const NSFW = require("discord-nsfw");

module.exports = {
  name: "hentai",
  group: "nsfwGroup",
  description: "hentaiDescription",
  async run(client, msg, args, prefix) {
    if (!msg.channel.nsfw) {
      return msg.reply(msg.t("notNsfwChannel"));
    }

    const image = await new NSFW().hentai();

    const embed = {
      color: await msg.author.embColor(),
      image: { url: image },
    };

    await msg.reply({ embed });
  }
}