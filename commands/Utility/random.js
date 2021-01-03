function randInt(max, min = 1) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  name: "random",
  group: "utilityGroup",
  description: "randomDescription",
  usage: [ "randomUsageMax", "randomUsageMinMax" ],
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    }

    let [ min, max ] = args;
    if (!max) {
      max = min;
      min = 1;
    }

    max = parseInt(max);
    min = parseInt(min);

    if (isNaN(min) || isNaN(max)) {
      return msg.channel.createMessage(lang.notANumber);
    }

    const embed = {
      title: lang.randomTitle(min, max),
      description: randInt(max, min),
      color: await msg.author.embColor(),
    };

    await msg.channel.createMessage({ embed });
  }
}
