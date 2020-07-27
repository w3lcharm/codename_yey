const CmdClient = require("./client");
const config = require("../config");
// const { inspect } = require("util");
const SDC = require("@megavasiliy007/sdc-api");
const DBL = require("dblapi.js");

const autoroleFunc = require("./utils/autorole");
const modlogFunctions = require("./utils/modlogs");
const errorHandler = require("./utils/errHandler");

const client = new CmdClient(config.token, {
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

client.on("guildMemberAdd", (guild, member) => autoroleFunc(client, guild, member));

client.on("commandError", async (commandName, msg, error, showErr, lang = client.languages.get("en")) => {
  await errorHandler(client, commandName, msg, error, showErr, lang);
});
  
/* client.on("error", (error, id) => {
  client.logger.error(`Error in shard ${id}:\n${error.stack}`);
}); */

client.on("guildCreate", guild => client.logger.info(`New server: ${guild.name} (ID: ${guild.id})`))
  .on("guildDelete", guild => client.logger.info(`Left from server ${guild.name} (ID: ${guild.id})`))
  .on("guildMemberAdd", (guild, member) => modlogFunctions.onGuildMemberAdd(client, guild, member))
  .on("guildMemberRemove", (guild, member) => modlogFunctions.onGuildMemberRemove(client, guild, member))
  .on("guildBanRemove", (guild, user) => modlogFunctions.onGuildBanRemove(client, guild, user))
  .on("messageDelete", msg => modlogFunctions.onMessageDelete(client, msg))
  .on("messageUpdate", (newMsg, oldMsg) => modlogFunctions.onMessageUpdate(client, newMsg, oldMsg));
  
client.connect();
