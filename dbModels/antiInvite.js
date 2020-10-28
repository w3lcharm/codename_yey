module.exports = (sequelize, DataTypes) =>
  sequelize.define("antiInvite", {
    server: DataTypes.STRING,
    action: DataTypes.STRING,
  }, { timestamps: false });
