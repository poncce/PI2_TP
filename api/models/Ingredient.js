// models/Ingredient.js
const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');
const { configurarHooksBitacora, nivelesCriticidad } = require('./hooks/bitacora');

const Ingredient = sequelize.define('Ingredient', {
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
        msg: 'El nombre del ingrediente no puede estar vacío'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'general'
  },
  unit: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: 'unidad'
  },
  isCommon: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  allergen: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'Ingredients'
});

// Configurar hooks de bitácora para el modelo Ingredient
configurarHooksBitacora(Ingredient, 'Ingredient', {
  criticidad: nivelesCriticidad.administracion, // Operaciones de ingredientes son administrativas
  registrarCreacion: true,
  registrarModificacion: true,
  registrarBorrado: true
});

module.exports = {
  Ingredient
};