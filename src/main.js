const CmdClient = require("./core/client");
const path = require("path");

const SDC = require("@megavasiliy007/sdc-api");
const DBL = require("dblapi.js");

const errorHandler = require("./extensions/errHandler");

let config;
try {
  config = require("../config");
} catch {
  console.error("No config file found. Exiting...");
  process.exit(1);
}

global.client = new CmdClient(config.token, {
  prefix: config.prefix,
  owners: config.owners,
  db: config.database,
  debugMode: config.debugMode,
  supportChannelID: config.supportChannelID,
  guildSubscriptions: false,
  intents: [
    "guilds", "guildMembers", "guildBans",
    "guildPresences", "guildMessages", "directMessages",
    "guildMessageReactions",
  ],
  defaultImageSize: 2048,
});

const sdcClient = new SDC(config.sdcApiKey);

let dblClient;
if (!client.debugMode) {
  dblClient = new DBL(config.dblApiKey, client);
}

process.on("unhandledRejection", reason => {
  console.warn(`Unhandled promise rejection:\n${reason instanceof Error ? reason.stack : reason}`);
});

process.on("uncaughtException", e => console.warn(`Uncaught exception:\n${e.stack}`));

client.loadGroups([
  "Basic",
  "Utility",
  "Moderation",
  "Fun",
  "Misc",
  "Settings",
  "Dev",
], path.join(__dirname, "commands"));

client.once("ready", () => {
  if (!client.debugMode) {
    sdcClient.setAutoPost(client);
  }
  editStatus();
});

client.on("commandError", async (commandName, msg, error, showErr, lang = client.languages.get("en")) => {
  await errorHandler(client, commandName, msg, error, showErr, lang);
});

client.loadExtension(path.join(__dirname, "extensions/autorole.js"));
client.loadExtension(path.join(__dirname, "extensions/modlogs.js"));
client.loadExtension(path.join(__dirname, "extensions/welcomeMessages.js"));
  
client.on("error", (error, id) => {
  client.logger.error(`Error in shard ${id}:\n${error.stack}`);
});

client.on("guildCreate", guild => client.logger.info(`New server: ${guild.name} (ID: ${guild.id})`))
  .on("guildDelete", guild => client.logger.info(`Left from server ${guild.name} (ID: ${guild.id})`));

function editStatus() {
  return client.editStatus({ name: `on ${client.guilds.size} servers | you can mention me to find out my prefix` });
}
client.on("guildCreate", editStatus)
  .on("guildDelete", editStatus);

client.connect();
