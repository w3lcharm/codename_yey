module.exports = (sequelize, DataTypes) => {
	return sequelize.define("modlogs", {
		server: DataTypes.STRING,
		channel: DataTypes.STRING,
	}, { timestamps: false });
};
