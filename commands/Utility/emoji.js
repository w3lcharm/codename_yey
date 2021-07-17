module.exports = {
  name: "emoji",
  group: "utility",
  description: "emojiDescription",
  usage: "emojiUsage",
  argsRequired: true,
  aliases: [ "e" ],
  async run(client, msg, args, prefix) {
    const emoji = args[0];
    if (!emoji) {
      return msg.reply(msg.t("noEmoji"));
    }

    if (!/<(a:|:).+?:\d+>/g.test(emoji)) {
      return msg.reply(msg.t("invalidEmoji"));
    }

    const emojiID = emoji.match(/(?<=:)\d+/g)[0];
    const emojiName = emoji.match(/:\w+?:/)[0];
    const isAnimated = /<a/.test(emoji);

    const url = `https://cdn.discordapp.com/emojis/${emojiID}.${isAnimated ? "gif" : "png"}?v=1`;

    const embed = {
      title: emojiName,
      color: await msg.author.embColor(),
      image: { url },
      footer: { text: msg.t("emojiID", emojiID) },
    };

    await msg.reply({ embed, components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            label: msg.t("emojiURL", url),
            style: 5,
            url,
          },
        ],
      },
    ]});
  }
}