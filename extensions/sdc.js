const fetch = require("node-fetch");
const Logger = require("../core/Logger");
const { stringify } = require("querystring");

const apiURL = "https://api.server-discord.com/v2";
let apiKey;

let interval;

async function postStats(client) {
  const response = await fetch(`${apiURL}/bots/${client.user.id}/stats`, {
    method: "POST",
    headers: { Authorization: apiKey, "Content-Type": "application/x-www-form-urlencoded" },
    body: stringify({ shards: client.shards.size, servers: client.guilds.size }),
  });
  const data = await response.json();

  if (response.status != 200) {
    throw new Error(`${data.error.code} ${data.error.type}: ${data.error.message}`);
  }
}

module.exports.load = (client, key = config.sdcApiKey) => {
  const logger = new Logger(Logger.INFO, "sdc");

  if (!key) return logger.warn("No API key provided.");
  apiKey = "SDC " + key;

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
