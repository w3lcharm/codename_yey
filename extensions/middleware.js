module.exports.load = client => {
  client.addMiddleware(async msg => {
    return client.languages.get((await db.languages.findOrCreate({ where: { user: msg.author.id } }))[0].lang)
  })
}