//db

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('proyecto', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = { sequelize };
