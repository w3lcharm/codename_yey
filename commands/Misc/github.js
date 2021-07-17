const fetch = require("node-fetch");

module.exports = {
  name: "github",
  group: "misc",
  description: "githubDescription",
  usage: "githubUsage",
  aliases: [ "gh" ],
  argsRequired: true,
  async run(client, msg, args, prefix) {
    if (!args.length) {
      return msg.reply(msg.t("commandUsage", prefix, this));
    }

    const query = args.raw.join(" ");

    const data = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `token ${config.githubKey}` },
    }).then(r => r.json());
    
    if (!data.total_count) {
      return msg.reply(msg.t("githubRepoNotFound"));
    }

    const repo = data.items[0];

    const embed = {
      author: {
        name: repo.full_name,
        icon_url: repo.owner.avatar_url,
        url: repo.html_url,
      },
      description: repo.description,
      color: await msg.author.embColor(),
      fields: [
        {
          name: msg.t("githubStars"),
          value: repo.stargazers_count,
          inline: true,
        },
        {
          name: msg.t("githubForks"),
          value: repo.forks_count,
          inline: true,
        },
      ],
      footer: { text: msg.t("githubRepoCreatedAt") },
      timestamp: repo.created_at,
    };

    if (repo.license) embed.fields.push({
      name: msg.t("githubLicense"),
      value: repo.license.name,
    });

    if (repo.language) embed.fields.push({
      name: msg.t("githubLanguage"),
      value: repo.language,
    });

    await msg.reply({ embed });
  }
};
