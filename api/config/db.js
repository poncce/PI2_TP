//db

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('paulinacultiva', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = { sequelize };
