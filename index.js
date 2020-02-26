const CmdClient = require("./src/client");
const Sequelize = require("sequelize");
const config = require("./config.json");

const autorole = require("./src/modules/autorole");

const client = new CmdClient(config.token, {
	prefix: config.prefix,
	owners: config.owners,
});

global.sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./bot.db",
	logging: false,
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
	console.log(`${client.user.username} online!`);
	sequelize.sync();
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
	console.log(`Error in command ${commandName}:\n${error.stack}`);
});

client.connect();
