module.exports = (sequelize, DataTypes) => {
  return sequelize.define("languages", {
    user: DataTypes.STRING,
    lang: {
      type: DataTypes.STRING,
      defaultValue: "en",
    }
  }, { timestamps: false });
}