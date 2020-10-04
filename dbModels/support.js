module.exports = (sequelize, DataTypes) => {
  return sequelize.define("support", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user: DataTypes.STRING,
    channel: DataTypes.STRING,
    question: DataTypes.TEXT,
  }, { timestamps: false });
}
