const fetch = require("node-fetch");

module.exports = {
  name: "github",
  group: "miscGroup",
  description: "githubDescription",
  usage: "githubUsage",
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    }

    const query = args.raw.join(" ");

    const data = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `token ${config.githubKey}` },
    }).then(r => r.json());
    
    if (!data.total_count) {
      return msg.channel.createMessage(lang.githubRepoNotFound);
    }

    const repo = data.items[0];

    const embed = {
      author: {
        name: repo.full_name,
        icon_url: repo.owner.avatar_url,
        url: repo.html_url,
      },
      description: repo.description,
      color: Math.round(Math.random() * 16777216),
      fields: [
        {
          name: lang.githubStars,
          value: repo.stargazers_count,
          inline: true,
        },
        {
          name: lang.githubForks,
          value: repo.forks_count,
          inline: true,
        },
      ],
      footer: { text: lang.githubRepoCreatedAt },
      timestamp: repo.created_at,
    };

    if (repo.license) embed.fields.push({
      name: lang.githubLicense,
      value: repo.license.name,
    });

    if (repo.language) embed.fields.push({
      name: lang.githubLanguage,
      value: repo.language,
    });

    await msg.channel.createMessage({ embed });
  }
};
