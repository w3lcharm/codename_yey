module.exports.load = client => {
  client.addMiddleware(async msg => {
    return msg.author.lang = (await db.languages.findOrCreate({ where: { user: msg.author.id } }))[0].lang
  });

  client.addMiddleware(async (msg, prefix, data) => {
    if (msg.content.replace("<@!", "<@") === client.user.mention) {
      await msg.reply(data[0].botPrefix(prefix, msg.author));
      return false;
    }

    return true;
  })
}