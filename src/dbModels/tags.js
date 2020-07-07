module.exports = (sequelize, DataTypes) => {
  return sequelize.define("tags", {
    owner: DataTypes.STRING,
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
    guildTag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, { timestamps: false });
}
