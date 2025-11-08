// models/Cuisine.js
const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');
const { configurarHooksBitacora, nivelesCriticidad } = require('./hooks/bitacora');

const Cuisine = sequelize.define('Cuisine', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El nombre de la cocina no puede estar vacío'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  origin: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  flag: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'Cuisines'
});

// Configurar hooks de bitácora para el modelo Cuisine
configurarHooksBitacora(Cuisine, 'Cuisine', {
  criticidad: nivelesCriticidad.administracion, // Operaciones de cocinas son administrativas
  registrarCreacion: true,
  registrarModificacion: true,
  registrarBorrado: true
});

module.exports = {
  Cuisine
};