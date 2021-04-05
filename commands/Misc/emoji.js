module.exports = {
  name: "emoji",
  group: "miscGroup",
  description: "emojiDescription",
  usage: "emojiUsage",
  argsRequired: true,
  async run(client, msg, args, prefix) {
    const emoji = args[0];
    if (!emoji) {
      return msg.reply(msg.t("noEmoji"));
    }

    if (!/<a:.+?:\d+>|<:.+?:\d+>/g.test(emoji)) {
      return msg.reply(msg.t("invalidEmoji"));
    }

    const emojiID = emoji.match(/(?<=:)\d+/g)[0];
    const emojiName = emoji.match(/:\w+?:/)[0];
    const isAnimated = /<a/.test(emoji);

    const url = `https://cdn.discordapp.com/emojis/${emojiID}.${isAnimated ? "gif" : "png"}?v=1`;
    console.log(url);
    const embed = {
      title: emojiName,
      color: await msg.author.embColor(),
      image: { url },
    };

    await msg.reply({ embed });
  }
}