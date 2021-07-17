module.exports = {
  name: "language",
  group: "settings",
  description: "languageDescription",
  usage: "languageUsage",
  aliases: [ "lang" ],
  async run(client, msg, args, prefix) {
    let langName = args[0];
    if (!langName) {
      let userLanguage = await db.languages.findOne({ where: { user: msg.author.id } })
        .then(l => l.lang);

      let embed = {
        title: msg.t("availableLanguages"),
        description: Array.from(client.languages.keys()).map(l => `\`${l}\``)
          .join(", "),
        color: await msg.author.embColor(),
        footer: { text: msg.t("languagesTip", prefix) },
        fields: [
          {
            name: msg.t("yourLanguage"),
            value: `\`${userLanguage}\``,
          },
        ],
      };
      await msg.reply({ embed });
    } else {
      if (!client.languages.has(langName)) {
        return msg.reply(msg.t("langDoesntExist"));
      }

      await db.languages.update(
        { lang: langName },
        { where: { user: msg.author.id } }
      );

      msg.author.lang = langName;
      await msg.reply(msg.t("langSuccess", langName));
    }
  }
};
