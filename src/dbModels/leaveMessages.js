module.exports = (sequelize, DataTypes) => {
  return sequelize.define("leaveMessages", {
    server: DataTypes.STRING,
    channel: DataTypes.STRING,
    message: DataTypes.TEXT,
  }, { timestamps: false });
}
