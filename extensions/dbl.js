const fetch = require("node-fetch");
const Logger = require("../core/logger");

const apiURL = "https://top.gg/api";
let apiKey;

let interval;

async function postStats(client) {
  const body = JSON.stringify({ server_count: client.guilds.size });
  const headers = { Authorization: apiKey, "Content-Type": "application/json" };

  const response = await fetch(`${apiURL}/bots/${client.user.id}/stats`, { method: "POST", headers, body });
  const data = await response.json()
  if (response.status != 200) {
    throw new Error(`${response.status} ${data.error}`);
  }
}

module.exports.load = (client, key = config.dblApiKey) => {
  const logger = new Logger(Logger.INFO, "dbl");

  if (!key) return logger.warn("No API key provided.");
  apiKey = key;

  async function postHandler() {
    try {
      await postStats(client);
      logger.info("stats posted.");
    } catch (err) {
      logger.error(`An error occurred:\n${err.stack}`);
    }
  }

  client.once("ready", postHandler);

  interval = setInterval(postHandler, 1800000);
}

module.exports.unload = () => clearInterval(interval);
