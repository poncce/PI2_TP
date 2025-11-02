const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');

const DigitoVerificador = sequelize.define('DigitoVerificador', {
  tabla: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  dvv: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: false
});

module.exports = {
  DigitoVerificador
};