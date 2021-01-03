module.exports = (sequelize, DataTypes) =>
  sequelize.define("embColors", {
    user: DataTypes.STRING,
    color: DataTypes.INTEGER,
    isRandom: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, { timestamps: false });