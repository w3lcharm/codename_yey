const { Manager } = require("erela.js");
const Logger = require("../core/Logger");

module.exports.load = client => {
  if (!config.lavalinkNodes) return;

  const logger = new Logger(Logger.INFO, "lavalink");

  client.lavalinkManager = new Manager({
    nodes: config.lavalinkNodes,
    send(id, packet) {
      client.guilds.get(id)?.shard.sendWS(packet.op, packet.d, false);
    },
  });

  client.once("ready", () => client.lavalinkManager.init(client.user.id))
    .on("rawWS", data => client.lavalinkManager.updateVoiceState(data));

  client.lavalinkManager.on("nodeError", (node, error) => logger.error(`An error occurred on node ${node.id}:\n${error.stack}`));
  client.lavalinkManager.on("nodeConnect", node => logger.info(`Node ${node.options.identifier} connected.`));
}