const Sequelize = require('sequelize');
const sequelize = require('../config/database');


const db = {};


db.Sequelize = Sequelize;
db.sequelize = sequelize;


// Models
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Categoria = require('./categoria')(sequelize, Sequelize.DataTypes);
db.Producto = require('./productos')(sequelize, Sequelize.DataTypes);


module.exports = db;