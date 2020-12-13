const ReactionHandler = require("../../core/ReactionHandler");
const parseTime = require("../../utils/parseTime");

module.exports = {
  name: "queue",
  group: "musicGroup",
  description: "queueDescription",
  async run(client, msg, args, prefix, lang) {
    const player = client.lavalinkManager.players.get(msg.guild.id);
    if (!player) {
      return msg.channel.createMessage(lang.notPlaying);
    }

    const embed = {
      title: lang.trackQueue,
    };

    const fields = [];
    let index = 0;
    for (const track of player.queue) {
      fields.push({
        name: `${++index}: ${track.title}`,
        value: lang.durationRequestedBy(parseTime(Math.floor(track.duration / 1000)), track.requester.tag),
      });
    }

    if (!fields.length) {
      return msg.channel.createMessage(lang.queueIsEmpty);
    }

    if (fields.length > 10) {
      const pages = [];

      while (fields.length) {
        const arr = []
        for (const field of fields.splice(0, 10)) {
          arr.push(field);
        }
        pages.push(arr);
      }

      let pageNumber = 0;
      embed.fields = pages[pageNumber];

      const message = await msg.channel.createMessage({ embed });
      message.addReaction("◀️");
      message.addReaction("▶️");

      const reactionHandler = new ReactionHandler(message, u => u == msg.author.id, 300000);
      reactionHandler.on("reaction", (msg, emoji) => {
        switch (emoji.name) {
          case "◀️":
            if (pageNumber === 0) return;
            pageNumber--;
            break;
          case "▶️":
            if (pageNumber === (pages.length - 1)) return;
            pageNumber++;
            break;
          default: return;
        }
      });
    } else {
      embed.fields = fields;
      await msg.channel.createMessage({ embed });
    }
  }
}
