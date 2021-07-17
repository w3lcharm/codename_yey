module.exports = {
  name: "discriminator",
  group: "utility",
  description: "discriminatorDescription",
  usage: "discriminatorUsage",
  aliases: [ "discrim" ],
  async run(client, msg, args, prefix) {
    let discriminator = args[0] || msg.author.discriminator;

    const discrimNumber = parseInt(discriminator);
    if (isNaN(discrimNumber) || discrimNumber > 9999 || discrimNumber < 1 || !/\d{4}$/g.test(discriminator.toString())) {
      return msg.reply(msg.t("invalidDiscriminator"));
    }

    const users = Array.from(client.users.values())
      .filter(u => u.discriminator === discriminator)
      .splice(0, 20)
      .map(u => u.tag)
      .join("\n")
      .replace(/[_~*\|]/g, "\\$&");

    const embed = {
      title: msg.t("discriminatorEmbedTitle", discriminator),
      description: users || msg.t("discriminatorNoUsersFound"),
      color: await msg.author.embColor(),
    };

    await msg.reply({ embed });
  }
}
