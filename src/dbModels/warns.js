module.exports = (sequelize, DataTypes) => {
  return sequelize.define("warns", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    server: DataTypes.STRING,
    user: DataTypes.STRING,
    warnedBy: DataTypes.STRING,
    reason: DataTypes.TEXT,
  });
}
