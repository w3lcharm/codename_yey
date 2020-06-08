const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

module.exports = {
  name: "ud",
  group: "utilityGroup",
  description: "udDescription",
  usage: "udUsage",
  async run(client, msg, args, prefix, lang) {
    if (!args.length)
      return msg.channel.createMessage(lang.commandUsage(prefix, this));

    const word = msg.content.slice(prefix.length + this.name.length + 1);

    const params = new URLSearchParams();
    params.append("term", word);

    const resp = await fetch(`http://api.urbandictionary.com/v0/define?${params}`);
    const data = (await resp.json()).list[0];

    if (!data) {
      return msg.channel.createMessage({
        embed: {
          title: lang.wordNotFound,
          color: 15158332,
        },
      });
    }

    if ((!data.definition.length || data.definition.length > 1980) ||
      (!data.example.length || data.example.length > 1000)) {
      return msg.channel.createMessage({
        embed: {
          title: lang.cantShowDefinition,
          description: lang.linkToDefinition(data.permalink),
          color: 15158332,
        },
      });
    }


    const embed = {
      title: data.word,
      description: data.definition,
      url: data.permalink,
      color: Math.round(Math.random() * 16777216) + 1,
      fields: [
        {
          name: lang.example,
          value: data.example,
        },
      ],
      footer: {
        text: lang.author(data.author),
      },
    };
    await msg.channel.createMessage({ embed: embed });
  }
};
