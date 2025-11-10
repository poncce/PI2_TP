const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');

const DigitoVerificador = sequelize.define('digitos_verificadores', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_tabla: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nombre_tabla'
  },
  id_registro: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_registro'
  },
  dv: {
    type: DataTypes.STRING(64),
    allowNull: false,
    field: 'dv'
  },
  fecha_calculo: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha_calculo'
  },
  estado: {
    type: DataTypes.ENUM('activo', 'eliminado'),
    allowNull: false,
    defaultValue: 'activo'
  }
}, {
  tableName: 'digitos_verificadores',
  timestamps: true
});

module.exports = {
  DigitoVerificador
};