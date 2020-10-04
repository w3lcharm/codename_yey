module.exports = {
  name: "discriminator",
  group: "utilityGroup",
  description: "discriminatorDescription",
  usage: "discriminatorUsage",
  aliases: [ "discrim" ],
  async run(client, msg, args, prefix, lang) {
    let discriminator = args[0] || msg.author.discriminator;

    const discrimNumber = parseInt(discriminator);
    if (isNaN(discrimNumber) || discrimNumber > 9999 || discrimNumber < 1) {
      return msg.channel.createMessage(lang.invalidDiscriminator);
    }

    while (discriminator.length < 4) {
      discriminator = "0" + discriminator;
    }

    const users = Array.from(client.users.values())
      .filter(u => u.discriminator === discriminator)
      .splice(0, 20)
      .map(u => u.tag)
      .join("\n");

    const embed = {
      title: lang.discriminatorEmbedTitle(discriminator),
      description: users || lang.discriminatorNoUsersFound,
      color: Math.round(Math.random() * 16777216),
    };

    await msg.channel.createMessage({ embed });
  }
}
