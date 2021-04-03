const CmdClient = require("./core/CmdClient");
const path = require("path");
const fs = require("fs");

try {
  global.config = require("./config");
} catch {
  console.error("No config file found. Exiting...");
  process.exit(1);
}

global.client = new CmdClient(config.token, {
  async prefix(client, msg) {
    return await db.prefixes.findOne({ where: { server: msg.guild.id } })
      .then(p => p && p.prefix) || config.prefix;  
  },
  owners: config.owners,
  debugMode: config.debugMode,
  guildSubscriptions: false,
  intents: [
    "guilds", "guildMembers", "guildBans",
    "guildMessages", "directMessages",
    "guildMessageReactions", "guildVoiceStates",
    "guildInvites",
  ],
  defaultImageSize: 2048,
  getAllUsers: true,
});

client.cmdLogsChannelID = config.cmdLogsChannelID;
client.usageCount = 0;

client.options.allowedMentions.replied_user = true;

const cmdGroups = [ "General", "Utility", "Moderation", "Fun", "Misc", "Music", "Settings", "Dev" ];
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

function editStatus() {
  return client.editStatus({ name: `on ${client.guilds.size} servers | type @${client.user.username}` });
}
client.on("guildCreate", editStatus)
  .on("guildDelete", editStatus)
  .once("ready", editStatus);

client.connect();
