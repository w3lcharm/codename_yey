const fetch = require("node-fetch");
const { parseStringPromise } = require("xml2js");
const randomArrayItem = require("../../utils/randomArrayItem");

module.exports = {
  name: "rule34",
  group: "nsfwGroup",
  description: "rule34Description",
  usage: "rule34Usage",
  argsRequired: true,
  aliases: [ "r34" ],
  async run(client, msg, args, prefix) {
    if (!msg.channel.nsfw) {
      return msg.reply(msg.t("notNsfwChannel"));
    }

    const tags = args.join(" ");

    const response = await fetch(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(tags)}`)
      .then(r => r.text());

    // fuck rule34 api
    const data = await parseStringPromise(response);
    // also futanari is shit

    if (data.posts.$.count == 0) {
      return msg.reply(msg.t("noPostsFound", tags));
    }

    const post = randomArrayItem(data.posts.post).$;
    const postTags = post.tags.trim().split(" ").map(t => `\`${t}\``).join(", ").substring(0, 1024);

    if (post.tags.trim().split(" ").includes("video")) {
      return msg.reply(msg.t("rule34Video", post.file_url, postTags));
    }

    const embed = {
      title: msg.t("linkToPost"),
      url: `http://rule34.xxx/index.php?page=post&s=view&id=${post.id}`,
      color: await msg.author.embColor(),
      fields: [
        {
          name: msg.t("score"),
          value: post.score,
        },
        {
          name: msg.t("tags"),
          value: postTags,
        },
      ],
      image: { url: post.file_url },
    };

    await msg.reply({ embed });
  }
}