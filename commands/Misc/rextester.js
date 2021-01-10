const fetch = require("node-fetch");

const url = "https://rextester.com/rundotnet/api/";
const hastebinURL = "https://hastebin.com/"

module.exports = {
  name: "rextester",
  group: "miscGroup",
  description: "rextesterDescription",
  usage: "rextesterUsage",
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    }

    const code = msg.content.slice(prefix.length + this.name.length + 1);

    const encodedURL = `${url}?LanguageChoice=23&Program=${encodeURIComponent(code)}`;

    const response = await fetch(encodedURL, { method: "POST" })
      .then(r => r.json());

    if (response.Errors) {
      const embed = {
        title: lang.rextesterError,
        description: `\`\`\`${response.Errors}\`\`\``,
        color: 15158332,
        // footer: { text: lang.rextesterErrorFooter },
      };

      return msg.channel.createMessage({ embed });
    }

    if (response.Result && response.Result.length > 2000) {
      const doc = await fetch(hastebinURL + "documents", { method: "POST", body: response.Result })
        .then(r => r.json())
        .then(({ key }) => `${hastebinURL}${key}`);

      const embed = {
        title: lang.rextesterCantShowResult,
        description: doc,
        color: 15158332,
      }

      return msg.channel.createMessage({ embed });
    }

    const embed = {
      title: lang.rextesterSuccess,
      description: `\`\`\`${response.Result}\`\`\``,
      color: 3066993,
    };

    await msg.channel.createMessage(response.Result ? { embed } : lang.rextesterEmptyResult);
  }
}
