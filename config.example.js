module.exports = {
  prefix: "your prefix",
  token: "your-token",
  database: {
    dialect: "sqlite", // or any other dialect that Sequelize supports
    database: "database name", // this can be omitted if using sqlite
    username: "username", // this too
    password: "password", // and this
    host: "localhost", // and this
    storage: "./bot.db", // you should use that if you're using sqlite
  },
  owners: [ "insert-your-id-here" ],
  supportChannelID: "id", // this is needed for support command
  cmdLogsChannelID: "id", // the bot will send command logs to this channel
  githubKey: "your github key", // needed for github command
  lavalinkNodes: [ { host: "localhost", port: 2333, password: "youshallnotpass" } ], // list of lavalink nodes, needed for music
  defaultColor: 0xb35511, // default embed color
};
