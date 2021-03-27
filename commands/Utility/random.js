function randInt(max, min = 1) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  name: "random",
  group: "utilityGroup",
  description: "randomDescription",
  usage: [ "randomUsageMax", "randomUsageMinMax" ],
  argsRequired: true,
  async run(client, msg, args, prefix) {
    if (!args.length) {
      return msg.reply(msg.t("commandUsage", prefix, this));
    }

    let [ min, max ] = args;
    if (!max) {
      max = min;
      min = 1;
    }

    max = parseInt(max);
    min = parseInt(min);

    if (isNaN(min) || isNaN(max)) {
      return msg.reply(msg.t("notANumber"));
    }

    const embed = {
      title: msg.t("randomTitle", min, max),
      description: randInt(max, min).toString(),
      color: await msg.author.embColor(),
    };

    await msg.reply({ embed });
  }
}
