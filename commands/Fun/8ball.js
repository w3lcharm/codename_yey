function getRandom(arr) {
  return arr[Math.round(Math.random() * (arr.length - 1))];
}

function getNth(arr, n) {
  return arr[Math.abs(n) % arr.length];
}

const life = 42;
const vals = [ 4, 9, 6, 2, 5, 8, 1 ];

const ansMapping = [
  true, true, true, true, true, true, true, true,
  true, true, false, false, false, false, false,
];

function hashCode(s) {
  let h = 0, l = s.length, i = 0;

  if (l > 0) {
    while (i < l) {
      h = (h << 5) - h + s.charCodeAt(i++) | 0;
    }
  }

  return h;
}

function predict(question, failChance, seed, lang) {
  const clQuestion = question.toLowerCase()
    .replace(/[.,:;!?\s@#$%^&*()_+\-=]/g, "");

  if (Math.random() <= failChance) {
    return getRandom(lang._8ballFailAnswers);
  }

  const isPos = getNth(ansMapping, hashCode(clQuestion) + (seed *
    Math.round(life / getNth(vals, seed))));
  return getRandom(lang._8ballAnswers[isPos]);
}

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
      description: predict(question, 0.25, msg.author.id, lang),
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
