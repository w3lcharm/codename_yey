const fetch = require("node-fetch");

function generateID() {
  return Math.floor(Math.random() * 1e8).toString(16);
}

module.exports = {
  name: "support",
  group: "utilityGroup",
  description: "supportDescription",
  usage: "supportUsage",
  async run(client, msg, args, prefix, lang) {
    let userBan = await db.supportBans.findOne({ where: { user: msg.author.id } });
    if (userBan && userBan.banned) {
      return msg.channel.createMessage(lang.supportBan(userBan.reason));
    }

    if (!args.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    }

    let question = msg.content.slice(prefix.length + this.name.length + 1);
    if (!question) {
      return msg.channel.createMessage(lang.emptyQuestion);
    }

    let file;
    if (msg.attachments.length) {
      let buffer = await fetch(msg.attachments[0].url).then(r => r.buffer());

      file = {
        name: msg.attachments[0].filename,
        file: buffer,
      }
    }
  
    let id = generateID();
    let item = await db.support.findOne({ where: { id } });
    if (item) id = generateID();

    let supportEmbed = {
      author: {
        name: `Question by ${msg.author.tag}:`,
        icon_url: msg.author.avatarURL,
      },
      description: question,
      timestamp: new Date().toISOString(),
      footer: { text: `ID: ${id}` },
    };

    if (file) {
      supportEmbed.image = { url: `attachment://${file.name}` };
    }

    await db.support.create({
      id,
      user: msg.author.id,
      channel: msg.channel.id,
      question,
    });

    await client.createMessage(client.supportChannelID, { embed: supportEmbed }, file);
    await msg.channel.createMessage(lang.supportSuccess);
  }
};
