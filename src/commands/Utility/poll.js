module.exports = {
  name: "poll",
  group: "utilityGroup",
  description: "pollDescription",
  usage: "pollUsage",
  async run(client, msg, args, prefix, lang) {
    if (!args.length)
      return msg.channel.createMessage(lang.commandUsage(prefix, this));

    const [ question, ...answers ] = args;
    const reactions = [ "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯" ];

    if (!answers.length)
      return msg.channel.createMessage(lang.noAnswers);

    if (answers.length > 10)
      return msg.channel.createMessage(lang.pollNotMoreThan10Answers);

    const embed = {
      title: question,
      description: answers.map((a, i) => `${reactions[i]} - ${a}`).join("\n"),
      color: Math.round(Math.random() * 16777216) + 1,
      footer: {
        text: lang.startedBy(msg.author),
        icon_url: msg.author.avatarURL,
      },
    };

    const message = await msg.channel.createMessage({ embed: embed });

    for (let i = 0; i < answers.length; i++)
      await message.addReaction(reactions[i]);
  }
};
