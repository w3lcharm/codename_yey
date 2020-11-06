const CmdClient = require("./core/client");
const path = require("path");
const fs = require("fs");

try {
  global.config = require("./config");
} catch {
  console.error("No config file found. Exiting...");
  process.exit(1);
}

global.client = new CmdClient(config.token, {
  prefix: config.prefix,
  owners: config.owners,
  db: config.database,
  debugMode: config.debugMode,
  guildSubscriptions: false,
  intents: [
    "guilds", "guildMembers", "guildBans",
    "guildMessages", "directMessages",
    "guildMessageReactions", "guildVoiceStates",
  ],
  defaultImageSize: 2048,
});

client.version = "2.5.4";
client.supportChannelID = config.supportChannelID;
client.cmdLogsChannelID = config.cmdLogsChannelID;

const cmdGroups = [ "Basic", "Utility", "Moderation", "Fun", "Misc", "Settings", "Dev" ];
for (const group of cmdGroups) {
  client.loadCommandGroup(path.join(__dirname, "commands", group));
}

const extensions = fs.readdirSync(path.join(__dirname, "extensions"))
  .filter(f => f.endsWith(".js"));
for (const extension of extensions) {
  client.loadExtension(path.join(__dirname, "extensions", extension));
}

process.on("unhandledRejection", reason => {
  console.warn(`Unhandled promise rejection:\n${reason instanceof Error ? reason.stack : reason}`);
});
process.on("uncaughtException", e => console.warn(`Uncaught exception:\n${e.stack}`));

client.on("error", (error, id) => {
  client.logger.error(`Error in shard ${id}:\n${error.stack}`);
});

client.on("guildCreate", guild => client.logger.info(`New server: ${guild.name} (ID: ${guild.id})`))
  .on("guildDelete", guild => client.logger.info(`Left from server ${guild.name} (ID: ${guild.id})`));

function editStatus() {
  return client.editStatus({ name: `on ${client.guilds.size} servers | type @${client.user.username}` });
}
client.on("guildCreate", editStatus)
  .on("guildDelete", editStatus)
  .once("ready", editStatus);

client.connect();
