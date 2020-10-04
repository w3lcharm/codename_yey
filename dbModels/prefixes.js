module.exports = (sequelize, DataTypes) =>
  sequelize.define("prefixes", {
    server: DataTypes.STRING,
    prefix: DataTypes.STRING,
  }, { timestamps: false });
