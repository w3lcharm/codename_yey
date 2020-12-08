const { Manager } = require("lavacord");
const Logger = require("../core/Logger");

module.exports.load = client => {
  if (!config.lavalinkNodes) return;

  client.on("ready", () => {
    const logger = new Logger(Logger.INFO, "lavalink");

    client.lavalinkManager = new Manager(config.lavalinkNodes, {
      user: client.user.id,
      shards: client.shards.size,
      send(packet) {
        return client.guilds.get(packet.d.guild_id)?.shard.sendWS(packet.op, packet.d, false);
      },
    });

    client.lavalinkManager.on("error", (error, node) => logger.error(`An error occurred on node ${node.id}:\n${error.stack}`));
    client.lavalinkManager.connect();
  });
}