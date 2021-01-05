module.exports.load = client => {
  client.addMiddleware(async msg => {
    return await db.prefixes.findOne({ where: { server: msg.guild.id } })
      .then(p => p && p.prefix) || client.prefix;
  });

  client.addMiddleware(async msg => {
    return client.languages.get((await db.languages.findOrCreate({ where: { user: msg.author.id } }))[0].lang)
  })
}