const fs = require("fs");

module.exports = (sequelize, DataTypes) => {
  let models = {};

  for (let file of fs.readdirSync("./src/dbModels").filter(f => f.endsWith(".js"))) {
    let model = require(`../dbModels/${file}`)(sequelize, DataTypes);
    models[model.name] = model;
  }
  
  return models;
}
