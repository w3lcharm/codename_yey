const fetch = require("node-fetch");

module.exports = {
  name: "npm",
  group: "miscGroup",
  description: "npmDescription",
  usage: "npmUsage",
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    const query = args.raw.join(" ");
    if (!query) {
      return msg.reply(lang.npmNoPkg);
    }

    const response = await fetch(`https://registry.npmjs.org/${query}`)
      .then(r => r.json());

    console.log(Object.keys(response));

    if (!response || response.error) {
      return msg.reply(lang.npmPkgNotFound);
    }

    const package = response.versions[response["dist-tags"].latest];

    const embed = {
      title: package.name,
      description: package.description,
      url: `https://www.npmjs.org/package/${package.name}`,
      color: await msg.author.embColor(),
      fields: [
        {
          name: lang.npmVersion,
          value: package.version,
        },
      ],
      footer: { text: lang.npmModifiedAt },
      timestamp: response.time?.modified,
    };

    if (package.license) embed.fields.push({
      name: lang.npmLicense,
      value: package.license,
    });

    if (package.keywords?.length) embed.fields.push({
      name: lang.npmKeywords,
      value: package.keywords.map(k => `\`${k}\``).join(", "),
    });

    await msg.reply({ embed });
  }
}