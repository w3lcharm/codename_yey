module.exports = {
  name: "devsay",
  group: "devGroup",
  description: "devsayDescription",
  ownerOnly: true,
  hidden: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) return;

    let text = msg.content.slice(prefix.length + this.name.length + 1);

    try {
      await msg.delete();
      await msg.channel.createMessage(text);
    } catch {};
  }
}
