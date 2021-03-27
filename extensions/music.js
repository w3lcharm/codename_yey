const { Manager } = require("erela.js");
const Logger = require("../core/Logger");
const SpotifyPlugin = require("erela.js-spotify");

const parseTime = require("../utils/parseTime");

module.exports.load = client => {
  if (!config.lavalinkNodes) return;

  const logger = new Logger(Logger.INFO, "lavalink");

  client.lavalinkManager = new Manager({
    nodes: config.lavalinkNodes,
    send(id, packet) {
      client.guilds.get(id)?.shard.sendWS(packet.op, packet.d, false);
    },
    plugins: [
      new SpotifyPlugin({
        clientID: config.spotifyClientID,
        clientSecret: config.spotifyClientSecret,
      }),
    ],
  });

  client.once("ready", () => client.lavalinkManager.init(client.user.id))
    .on("rawWS", data => client.lavalinkManager.updateVoiceState(data));

  client.lavalinkManager.on("nodeError", (node, error) => logger.error(`An error occurred on node ${node.id}:\n${error.stack}`))
    .on("nodeConnect", node => logger.info(`Node ${node.options.identifier} connected.`))
    .on("trackStart", async (player, track) => {
      const lang = player.get("lang");

      const embed = {
        title: lang.nowPlaying,
        description: `[${track.title}](${track.uri})`,
        thumbnail: { url: track.thumbnail },
        fields: [
          {
            name: lang.duration,
            value: parseTime(Math.floor(track.duration / 1000)),
          },
        ],
        footer: { text: lang.playAuthor(track.author) },
      };

      await client.createMessage(player.textChannel, { embed });
    }).on("queueEnd", async player => {
      const lang = player.get("lang");

      await client.createMessage(player.textChannel, lang.allTracksPlayed);
      await player.destroy();
    }).on("playerMove", async (player, oldChannel, newChannel) => {
      const lang = player.get("lang");

      if (!newChannel) {
        await client.createMessage(player.textChannel, lang.allTracksPlayed);
        await player.destroy();
      }
    }).on("trackError", async (player, track, payload) => {
      const lang = player.get("lang");

      if (payload.error == "Track information is unavailable.") {
        const embed = {
          title: lang.playFailed,
          description: lang.playFailedDesc,
          color: 15158332,
        };

        await client.createMessage(player.textChannel, { embed });
      } else {
        logger.error("Failed to play the track:");
        console.log(payload);
      }
    });
}
