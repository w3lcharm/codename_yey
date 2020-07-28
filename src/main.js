const CmdClient = require("./client");
const config = require("../config");
// const { inspect } = require("util");
const SDC = require("@megavasiliy007/sdc-api");
const DBL = require("dblapi.js");

const errorHandler = require("./utils/errHandler");

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
  ],
  getAllUsers: true,
});

const sdcClient = new SDC(config.sdcApiKey);

let dblClient;
if (!client.debugMode) {
  dblClient = new DBL(config.dblApiKey, client);
  // dblLogger = new CmdClient.Logger(CmdClient.Logger.INFO, "dbl");

  // dblClient.on("posted", () => dblLogger.info("stats posted."));
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
  "Settings",
  "Dev",
]);

client.once("ready", () => {
  if (!client.debugMode) {
    sdcClient.setAutoPost(client);
  }
});

client.on("commandError", async (commandName, msg, error, showErr, lang = client.languages.get("en")) => {
  await errorHandler(client, commandName, msg, error, showErr, lang);
});

client.loadExtension("./utils/autorole");
client.loadExtension("./utils/modlogs");
client.loadExtension("./utils/welcomeMessages.js");
  
/* client.on("error", (error, id) => {
  client.logger.error(`Error in shard ${id}:\n${error.stack}`);
}); */

client.on("guildCreate", guild => client.logger.info(`New server: ${guild.name} (ID: ${guild.id})`))
  .on("guildDelete", guild => client.logger.info(`Left from server ${guild.name} (ID: ${guild.id})`));

client.connect();
