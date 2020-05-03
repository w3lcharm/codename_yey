const CmdClient = require("./client");
const Sequelize = require("sequelize");
const config = require("../config");
const { inspect } = require("util");

const autoroleFunc = require("./utils/autorole");

const client = new CmdClient(config.token, {
	prefix: config.prefix,
	owners: config.owners,
});

const sequelizeLogger = new CmdClient.Logger(client.debugMode ? CmdClient.Logger.TRACE : CmdClient.Logger.INFO, "sequelize");

global.sequelize = new Sequelize({
	host: "localhost",
	dialect: "sqlite",
	storage: config.pathToDBFile || "../bot.db",
	logging: (...msg) => sequelizeLogger.debug(msg),
});
global.warns = require("./dbModels/warns")(sequelize, Sequelize.DataTypes);
global.autorole = require("./dbModels/autorole")(sequelize, Sequelize.DataTypes);
global.modlogs = require("./dbModels/modlogs")(sequelize, Sequelize.DataTypes);

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

client.on("commandError", async (commandName, msg, error, showErr) => {
	if (error instanceof CmdClient.PermissionError) {
		const embed = {
			title: ":x: You don't have permissions to use this command.",
			description: `Missing permission: \`${error.missingPermission}\``,
			color: 15158332,
			footer: {
				text: "codename_yey",
				icon_url: client.user.avatarURL,
			},
		};
		return msg.channel.createMessage({ embed: embed });
	}

	const embed = {
		title: `:x: Error in command ${commandName}:`,
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

client.on("guildCreate", guild => client.logger.info(`New server: ${guild.name} (ID: ${guild.id})`));

client.on("guildDelete", guild => client.logger.info(`Left from server ${guild.name} (ID: ${guild.id})`));

client.connect();
