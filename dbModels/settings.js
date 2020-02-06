module.exports = (sequelize, DataTypes) => {
	return sequelize.define("settings", {
		server: DataTypes.STRING,
		autorole: DataTypes.STRING,
	});
}
