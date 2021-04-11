const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

module.exports = {
  name: "ud",
  group: "funGroup",
  description: "udDescription",
  usage: "udUsage",
  cooldown: 10,
  argsRequired: true,
  async run(client, msg, args, prefix) {
    if (!args.length)
      return msg.reply(msg.t("commandUsage", prefix, this));

    const word = args.raw.join(" ");

    const params = new URLSearchParams();
    params.append("term", word);

    const resp = await fetch(`http://api.urbandictionary.com/v0/define?${params}`)
      .then(r => r.json());

    if (resp.error) {
      return msg.reply(msg.t("apiError"));
    }

    const data = resp.list[0];

    if (!data) {
      return msg.reply({
        embed: {
          title: msg.t("wordNotFound"),
          color: 15158332,
        },
      });
    }

    if ((!data.definition.length || data.definition.length > 1980) ||
      data.example.length > 1000) {
      return msg.reply({
        embed: {
          title: msg.t("cantShowDefinition"),
          description: msg.t("linkToDefinition", data.permalink),
          color: 15158332,
        },
      });
    }


    const embed = {
      title: data.word,
      description: data.definition,
      url: data.permalink,
      color: await msg.author.embColor(),
      footer: {
        text: msg.t("author", data.author),
      },
    };

    if (data.example) {
      embed.fields = [
        {
          name: msg.t("example"),
          value: data.example,
        },
      ];
    }

    await msg.reply({ embed: embed });
  }
};
