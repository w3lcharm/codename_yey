const fetch = require("node-fetch");

const apiUrl = "http://api.qrserver.com/v1/read-qr-code/";

module.exports = {
  name: "decodeqr",
  group: "utilityGroup",
  description: "decodeqrDescription",
  usage: "decodeqrUsage",
  cooldown: 10,
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length && !msg.attachments.length) {
      return msg.reply(lang.commandUsage(prefix, this));
    }

    let url = args[0];
    if (!url) url = msg.attachments[0].url;
    url = encodeURI(url);

    let res = await fetch(`${apiUrl}?fileurl=${encodeURI(url)}`);
    if (res.status == 400) {
      return msg.reply(lang.decodeqrInvalidURL);
    }

    let code = await res.json();
    if (!code[0].symbol[0].error) {
      await msg.reply(`\`\`\`${code[0].symbol[0].data}\`\`\``);
    } else {
      await msg.reply(lang.decodeqrFail);
    }
  }
}
