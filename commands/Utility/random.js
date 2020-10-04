function randInt(max, min = 1) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  name: "random",
  group: "utilityGroup",
  description: "randomDescription",
  usage: [ "randomUsageMax", "randomUsageMinMax" ],
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    }

    let [ min, max ] = args;
    min = parseInt(min);
    if (isNaN(min)) {
      return msg.channel.createMessage(lang.notANumber);
    }

    let randNumber;
    if (!max) {
      randNumber = randInt(min);
    } else {
      max = parseInt(max);
      if (isNaN(max)) {
        return msg.channel.createMessage(lang.notANumber);
      }

      randNumber = randInt(max, min);
    }

    await msg.channel.createMessage(randNumber);
  }
}