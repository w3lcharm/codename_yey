module.exports = {
  name: "language",
  group: "settingsGroup",
  description: "languageDescription",
  usage: "languageUsage",
  aliases: [ "lang" ],
  async run(client, msg, args, prefix, lang) {
    let langName = args[0];
    if (!langName) {
      let userLanguage = await db.languages.findOne({ where: { user: msg.author.id } })
        .then(l => l.lang);

      let embed = {
        title: lang.availableLanguages,
        description: Array.from(client.languages.keys()).map(l => `\`${l}\``)
          .join(", "),
        color: await msg.author.embColor(),
        footer: { text: lang.languagesTip(prefix) },
        fields: [
          {
            name: lang.yourLanguage,
            value: `\`${userLanguage}\``,
          },
        ],
      };
      await msg.reply({ embed });
    } else {
      if (!client.languages.has(langName)) {
        return msg.reply(lang.langDoesntExist);
      }

      await db.languages.update(
        { lang: langName },
        { where: { user: msg.author.id } }
      );

      let newLang = client.languages.get(langName);
      await msg.reply(newLang.langSuccess(langName));
    }
  }
};
