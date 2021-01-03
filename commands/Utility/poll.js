module.exports = {
  name: "poll",
  group: "utilityGroup",
  description: "pollDescription",
  usage: "pollUsage",
  argsRequired: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    }

    let [ question, ...answers ] = args;
    const reactions = [ "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯" ];

    let deleteFlag;
    if (question === "-d" || question === "--delete") {
      deleteFlag = true;
      question = answers.shift();
    }

    if (!answers.length) {
      return msg.channel.createMessage(lang.noAnswers);
    }

    if (answers.length > 10) {
      return msg.channel.createMessage(lang.pollNotMoreThan10Answers);
    }

    const embed = {
      title: question,
      description: answers.map((a, i) => `${reactions[i]} - ${a}`).join("\n"),
      color: await msg.author.embColor(),
      footer: {
        text: lang.startedBy(msg.author),
        icon_url: msg.author.avatarURL,
      },
    };

    if (deleteFlag) {
      try {
        await msg.delete();
      } catch {
        await msg.channel.createMessage(lang.pollCantDeleteMessage);
      }
    }

    const message = await msg.channel.createMessage({ embed: embed });

    for (let i = 0; i < answers.length; i++) {
      await message.addReaction(reactions[i]);
    }
  }
};
