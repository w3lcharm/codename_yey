const fetch = require("node-fetch");

module.exports = {
  name: "devsay",
  group: "devGroup",
  description: "devsayDescription",
  ownerOnly: true,
  hidden: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length && !msg.attachments.length) return;

    const text = msg.content.slice(prefix.length + this.name.length + 1);

    try {
      let files = [];

      for (const attachment of msg.attachments) {
        const fileBuffer = await fetch(attachment.url).then(r => r.buffer());

        files.push({
          name: attachment.filename,
          file: fileBuffer,
        });
      }

      await msg.delete();
      await client.createMessage(msg.channel.id, text, files);
    } catch {};
  }
}
