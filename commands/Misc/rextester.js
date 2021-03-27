const fetch = require("node-fetch");

const url = "https://rextester.com/rundotnet/api/";

module.exports = {
  name: "rextester",
  group: "miscGroup",
  description: "rextesterDescription",
  usage: "rextesterUsage",
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.reply(msg.t("commandUsage", prefix, this));
    }

    const code = msg.content.slice(prefix.length + this.name.length + 1);

    const encodedURL = `${url}?LanguageChoice=23&Program=${encodeURIComponent(code)}`;

    const response = await fetch(encodedURL, { method: "POST" })
      .then(r => r.json());

    if (response.Errors) {
      const embed = {
        title: msg.t("rextesterError"),
        description: `\`\`\`${response.Errors}\`\`\``,
        color: 15158332,
        // footer: { text: lang.rextesterErrorFooter },
      };

      return msg.reply({ embed });
    }

    if (response.Result && response.Result.length > 2000) {
      const file = Buffer.from(response.Result);

      return msg.reply("", { name: "result.txt", file });
    }

    const embed = {
      title: msg.t("rextesterSuccess"),
      description: `\`\`\`${response.Result}\`\`\``,
      color: 3066993,
    };

    await msg.reply(response.Result ? { embed } : msg.t("rextesterEmptyResult"));
  }
}
