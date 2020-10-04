module.exports = (sequelize, DataTypes) =>
  sequelize.define("blacklist", {
    user: DataTypes.STRING,
    blacklisted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, { timestamps: false });
