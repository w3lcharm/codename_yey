const fetch = require("node-fetch");

module.exports = {
  name: "npm",
  group: "miscGroup",
  description: "npmDescription",
  usage: "npmUsage",
  argsRequired: true,
  async run(client, msg, args, prefix) {
    const query = encodeURIComponent(args.raw.join(" "));
    if (!query) {
      return msg.reply(msg.t("npmNoPkg"));
    }

    const response = await fetch(`https://registry.npmjs.org/${query}`)
      .then(r => r.json());

    if (!response || response.error) {
      return msg.reply(msg.t("npmPkgNotFound"));
    }

    const package = response.versions[response["dist-tags"].latest];

    const embed = {
      title: package.name,
      description: package.description,
      url: `https://www.npmjs.org/package/${package.name}`,
      color: await msg.author.embColor(),
      fields: [
        {
          name: msg.t("npmVersion"),
          value: package.version,
        },
      ],
      footer: { text: msg.t("npmModifiedAt") },
      timestamp: response.time?.modified,
    };

    if (package.license) embed.fields.push({
      name: msg.t("npmLicense"),
      value: package.license,
    });

    if (package.keywords?.length) embed.fields.push({
      name: msg.t("npmKeywords"),
      value: package.keywords.map(k => `\`${k}\``).join(", "),
    });

    await msg.reply({ embed });
  }
}