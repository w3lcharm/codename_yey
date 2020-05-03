module.exports = (sequelize, DataTypes) => {
	return sequelize.define("autorole", {
		server: DataTypes.STRING,
		autorole: DataTypes.STRING,
	}, { timestamps: false });
}
