const fetch = require("node-fetch");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getComic() {
  let comic = await fetch("http://xkcd.com/info.0.json")
    .then(r => r.json());

  let randomComicNum = randomInt(1, comic.num);

  return fetch(`http://xkcd.com/${randomComicNum}/info.0.json`)
    .then(r => r.json());
}

module.exports = {
  name: "xkcd",
  group: "funGroup",
  description: "xkcdDescription",
  async run(client, msg, args, prefix, lang) {
    let comic = await getComic();

    let embed = {
      title: comic.safe_title,
      color: await msg.author.embColor(),
      image: { url: comic.img },
    };
    await msg.channel.createMessage({ embed });
  }
}
