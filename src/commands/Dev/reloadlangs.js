module.exports = {
  name: "reloadlangs",
  group: "devGroup",
  description: "reloadlangsDescription",
  ownerOnly: true,
  hidden: true,
  async run(client, msg, args, prefix, lang) {
    client.reloadLangauges();
    await msg.addReaction("✅");
  }
}
