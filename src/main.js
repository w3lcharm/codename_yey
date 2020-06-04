const CmdClient = require("./client");
const Sequelize = require("sequelize");
const config = require("../config");
const { inspect } = require("util");

const autoroleFunc = require("./utils/autorole");
const modlogFunctions = require("./utils/modlogs");

const client = new CmdClient(config.token, {
	prefix: config.prefix,
	owners: config.owners,
//	debugMode: true,
});

const sequelizeLogger = new CmdClient.Logger(client.debugMode ? CmdClient.Logger.TRACE : CmdClient.Logger.INFO, "sequelize");

global.sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, {
	host: config.database.host,
	dialect: config.database.dialect,
	storage: config.database.storage || "./bot.db",
	logging: (...msg) => sequelizeLogger.debug(msg),
});
global.warns = require("./dbModels/warns")(sequelize, Sequelize.DataTypes);
global.autorole = require("./dbModels/autorole")(sequelize, Sequelize.DataTypes);
global.modlogs = require("./dbModels/modlogs")(sequelize, Sequelize.DataTypes);
global.languages = require("./dbModels/languages")(sequelize, Sequelize.DataTypes);

client.loadGroups([
	"Basic",
	"Utility",
	"Moderation",
	"Settings",
	"Dev",
]);

client.once("ready", () => {
	client.logger.info(`${client.user.username} online!`);
	client.editStatus("online", { name: `${config.prefix}help`, type: 3 });
	sequelize.sync()
		.then(() => client.logger.info("successfully connected to the database."));
});

client.on("guildMemberAdd", (guild, member) => autoroleFunc(client, guild, member));

client.on("commandError", async (commandName, msg, error, showErr, lang) => {
	if (error instanceof CmdClient.PermissionError) {
		const embed = {
			title: lang.dontHavePerms,
			description: lang.missingPermission(lang.permissions[error.missingPermission]),
			color: 15158332,
			footer: {
				text: "codename_yey",
				icon_url: client.user.avatarURL,
			},
		};
		return msg.channel.createMessage({ embed: embed });
	}

	const embed = {
		title: lang.errorInCommand(commandName),
		description: `\`\`\`\n${error}\`\`\``,
		color: 15158332,
	}
	if (showErr)
		await msg.channel.createMessage({ embed: embed });
	client.logger.error(`Error in command ${commandName}:\n${error.stack}`);
});

/* client.on("error", (error, id) => {
	client.logger.error(`Error in shard ${id}:\n${error.stack}`);
}); */

client.on("guildCreate", guild => client.logger.info(`New server: ${guild.name} (ID: ${guild.id})`))
	.on("guildDelete", guild => client.logger.info(`Left from server ${guild.name} (ID: ${guild.id})`))
	.on("guildMemberAdd", (guild, member) => modlogFunctions.onGuildMemberAdd(client, guild, member))
	.on("guildMemberRemove", (guild, member) => modlogFunctions.onGuildMemberRemove(client, guild, member))
	.on("guildBanAdd", (guild, user) => modlogFunctions.onGuildBanAdd(client, guild, user))
	.on("guildBanRemove", (guild, user) => modlogFunctions.onGuildBanRemove(client, guild, user))
	.on("messageDelete", msg => modlogFunctions.onMessageDelete(client, msg))
	.on("messageUpdate", (newMsg, oldMsg) => modlogFunctions.onMessageUpdate(client, newMsg, oldMsg));
	
client.connect();
