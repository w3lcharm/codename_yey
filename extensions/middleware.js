module.exports.load = client => {
  client.addMiddleware(async msg => {
    return msg.author.lang ? msg.author.lang :
      msg.author.lang = (await db.languages.findOrCreate({ where: { user: msg.author.id } }))[0].lang;
  });

  client.addMiddleware(async (msg, prefix, data) => {
    if (msg.content.replace("<@!", "<@") === client.user.mention) {
      await msg.reply({
        embed: {
          description: msg.t("botPrefix", prefix),
          footer: { text: msg.t("botPrefixFooter", prefix) },
          color: await msg.author.embColor(),
        },
      });
      return false;
    }

    return true;
  })
}