module.exports = (sequelize, DataTypes) => {
  return sequelize.define("welcomeMessages", {
    server: DataTypes.STRING,
    channel: DataTypes.STRING,
    message: DataTypes.TEXT,
  }, { timestamps: false });
}
