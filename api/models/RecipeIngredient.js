// models/RecipeIngredient.js
const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');
const { configurarHooksBitacora, nivelesCriticidad } = require('./hooks/bitacora');

const RecipeIngredient = sequelize.define('RecipeIngredient', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  postId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'Posts',
      key: 'id'
    }
  },
  ingredientName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nombre del ingrediente'
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  unit: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isOptional: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'RecipeIngredients'
});

// Configurar hooks de bitácora para el modelo RecipeIngredient
configurarHooksBitacora(RecipeIngredient, 'RecipeIngredient', {
  criticidad: nivelesCriticidad.contenido, // Operaciones de ingredientes de recetas son de contenido
  registrarCreacion: true,
  registrarModificacion: true,
  registrarBorrado: true
});

module.exports = {
  RecipeIngredient
};