module.exports = (sequelize, DataTypes) => 
  sequelize.define("reactionRoles", {
    channel: DataTypes.STRING,
    message: DataTypes.STRING,
    emoji: DataTypes.TEXT,
    role: DataTypes.STRING,
  }, { timestamps: false });