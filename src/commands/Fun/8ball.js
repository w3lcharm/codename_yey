const magicball = require("../../utils/8ball");

module.exports = {
  name: "8ball",
  group: "funGroup",
  description: "_8ballDescription",
  usage: "_8ballUsage",
  async run(client, msg, args, prefix, lang) {
    if (!args.length)
      return msg.channel.createMessage(lang.commandUsage(prefix, this));

    const question = msg.content.slice(prefix.length + this.name.length + 1);

    const embed = {
      title: lang.magicballAnswer,
      description: magicball.predict(question, 0.25, msg.author.id, lang.langName),
      color: 9807270,
      fields: [
        {
          name: lang.yourQuestion,
          value: question,
        },
      ],
    };

    await msg.channel.createMessage({ embed: embed });
  }
};
