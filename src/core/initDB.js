const fs = require("fs");
const path = require("path");

module.exports = (sequelize, DataTypes) => {
  let models = {};

  for (let file of fs.readdirSync(path.join(__dirname, "../dbModels"))
    .filter(f => f.endsWith(".js"))) {
      let model = require(`../dbModels/${file}`)(sequelize, DataTypes);
      models[model.name] = model;
  }
  
  return models;
}
