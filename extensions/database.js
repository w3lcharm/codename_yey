const Logger = require("../core/Logger");
const Sequelize = require("sequelize");
const initDB = require("../core/initDB");

module.exports.load = async client => {
  const databaseLogger = new Logger(Logger.INFO, "database");

  global.sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, {
    host: config.database.host,
    dialect: config.database.dialect,
    storage: config.database.storage,
    dialectOptions: { timezone: "Etc/GMT0" },
    logging: (...msg) => databaseLogger.debug(msg),
  });

  global.db = initDB(sequelize, Sequelize.DataTypes);

  client.once("ready", async () => {
    await sequelize.sync()
      .then(() => databaseLogger.info("connected to the database"));
  });
}