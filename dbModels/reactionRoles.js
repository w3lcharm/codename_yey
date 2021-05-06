module.exports = (sequelize, DataTypes) => 
  sequelize.define("reactionRoles", {
    channel: DataTypes.STRING,
    message: DataTypes.STRING,
    emojiName: DataTypes.TEXT,
    emojiID: DataTypes.TEXT,
    role: DataTypes.STRING,
  }, { timestamps: false });