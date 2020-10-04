module.exports = {
  name: "respond",
  group: "devGroup",
  description: "respondDescription",
  usage: "respondUsage",
  ownerOnly: true,
  hidden: true,
  async run(client, msg, args, prefix, lang) {
    if (!args.length) {
      return msg.channel.createMessage(lang.commandUsage(prefix, this));
    }

    let id = args[0];
    let answer = msg.content.slice(prefix.length + this.name.length + id.length + 2);

    let question = await db.support.findOne({ where: { id } });
    if (!question) {
      return msg.channel.createMessage(lang.respondInvalidID);
    }

    let userLang = await db.languages.findOne({ where: { user: question.user } })
      .then(l => client.languages.get(l.lang));

    let embed = {
      title: userLang.receivedAnswer,
      description: answer,
      fields: [
        {
          name: userLang.respondQuestion,
          value: question.question,
        },
      ],
      footer: {
        text: "codename_yey",
        icon_url: client.user.avatarURL,
      },
    };

    await client.createMessage(question.channel, { content: `<@${question.user}>`, embed });
    await msg.addReaction("✅");

    await question.destroy();
  }
}
