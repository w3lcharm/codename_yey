const fetch = require("node-fetch");
const Logger = require("../core/logger");

const apiURL = "https://api.server-discord.com/v2";
let apiKey;

let interval;

async function postStats(client) {
  const body = JSON.stringify({
    shards: client.shards.size,
    server_count: client.guilds.size,
  });
  const headers = { Authorization: apiKey };

  const response = await fetch(`${apiURL}/bots/${client.user.id}/stats`, { method: "POST", headers, body });
  const data = await response.json()
  if (response.status != 200) {
    throw new Error(`${data.error.code} ${data.error.type}: ${data.error.message}`);
  }
}

module.exports.load = (client, key) => {
  const logger = new Logger(Logger.INFO, "sdc");

  if (!key) return logger.warn("No API key provided.");
  apiKey = key;

  interval = setInterval(async () => {
    try {
      await postStats(client);
      logger.info("stats posted.");
    } catch (err) {
      logger.error(`An error occurred:\n${err.stack}`);
    }
  }, 1800000);
}

module.exports.unload = () => clearInterval(interval);