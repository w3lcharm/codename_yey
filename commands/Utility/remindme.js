function parseTime(time) {
  let timeNumber = parseInt(time.substring(0, time.length - 1), 10) * 1000;
  if (isNaN(timeNumber)) return;

  if (time.endsWith("s")) timeNumber *= 1;
  else if (time.endsWith("m")) timeNumber *= 60;
  else if (time.endsWith("h")) timeNumber *= 3600;
  else if (time.endsWith("d")) timeNumber *= 86400;
  else return;

  return timeNumber;
}

module.exports = {
  name: "remindme",
  group: "utilityGroup",
  description: "remindmeDescription",
  usage: "remindmeUsage",
  argsRequired: true,
  async run(client, msg, args, prefix) {
    if (!args.length) {
      return msg.reply(msg.t("commandUsage", prefix, this));
    }

    let time = args[0];

    let parsedTime = parseTime(args[0]); 
    if (!parsedTime) {
      return msg.reply(msg.t("remindmeInvalidTime"));
    }
    if (parsedTime > parseTime("7d")) {
      return msg.reply(msg.t("notMoreThan7Days"));
    }

    let text = msg.content.slice(prefix.length + this.name.length + time.length + 2);
    if (!text) {
      return msg.reply(msg.t("textCantBeEmpty"));
    }

    let embed = {
      title: msg.t("reminder"),
      description: text,
      timestamp: new Date().toISOString(),
      color: await msg.author.embColor(),
    };

    try {
      setTimeout(async () => {
        await msg.reply({ embed })
      }, parsedTime);

      await msg.reply(msg.t("remindmeSuccess"));
    } catch {}
  }
}
