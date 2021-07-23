const fetch = require("node-fetch");

module.exports = {
  name: "wikipedia",
  group: "misc",
  description: "wikipediaDescription",
  usage: "wikipediaUsage",
  aliases: [ "wiki" ],
  async run(client, msg, args, prefix) {
    const query = encodeURIComponent(args.raw.join(" "));
    if (!query) {
      return msg.reply(msg.t("wikipediaNoQuery"));
    }

    const response = await fetch(`https://${msg.t("langName")}.wikipedia.org/api/rest_v1/page/summary/${query}`)
    const data = await response.json();
    
    if (!data || data.title == "Not found." || response.status == 400) {
      return msg.reply(msg.t("wikipediaNotFound"));
    }

    if (data.type == "disambiguation") {
      return msg.reply({ content: msg.t("wikipediaDisambiguation"), components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: msg.t("wikipediaLinkToPage"),
              style: 5,
              url: data.content_urls.desktop.page,
            },
          ],
        },
      ]});
    }

    const embed = {
      title: data.title,
      url: data.content_urls.desktop.page,
      description: data.extract,
      thumbnail: { url: data.thumbnail?.source },
      color: await msg.author.embColor(),
    };

    await msg.reply({ embed });
  }
}