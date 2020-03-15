const CmdClient = require("./src/client");
const Sequelize = require("sequelize");
const config = require("./config.json");

const autorole = require("./src/modules/autorole");

const client = new CmdClient(config.token, {
	prefix: config.prefix,
	owners: config.owners,
});

const sequelizeLogger = new CmdClient.Logger(client.debugMode ? CmdClient.Logger.TRACE : CmdClient.Logger.INFO, "sequelize");

global.sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./bot.db",
	logging: (...msg) => sequelizeLogger.debug(msg),
});
global.warns = (require("./src/dbModels/warns"))(sequelize, Sequelize.DataTypes);
global.settings = (require("./src/dbModels/settings"))(sequelize, Sequelize.DataTypes);

client.loadGroups([
	"Basic",
	"Utility",
	"Moderation",
	"Settings",
	"Dev",
]);

client.on("ready", () => {
	client.logger.info(`${client.user.username} online!`);
	client.editStatus("online", { name: `now on Eris! | ${config.prefix}help` });
	sequelize.sync()
		.then(() => client.logger.info("successfully connected to the database."));
});

client.on("guildMemberAdd", (guild, member) => autorole(client, guild, member));

client.on("commandError", async (commandName, msg, error) => {
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
	await msg.channel.createMessage({ embed: embed });
	client.logger.error(`Error in command ${commandName}:\n${error.stack}`);
});

client.connect();
