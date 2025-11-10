const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');
const { configurarHooksBitacora, nivelesCriticidad } = require('./hooks/bitacora');
const { beforeCreateDVH, afterCreateDVH, beforeUpdateDVH, afterUpdateDVH } = require('../middlewares/dvhMiddleware');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  autorId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dvh: {
    type: DataTypes.STRING(8), // 8 caracteres hexadecimales
    allowNull: false,
    defaultValue: '00000000'
  },
  fechaPublicacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: 'Posts',
  hooks: {
    beforeCreate: beforeCreateDVH,
    afterCreate: afterCreateDVH,
    beforeUpdate: beforeUpdateDVH,
    afterUpdate: afterUpdateDVH
  }
});

// Configurar hooks de bitácora para el modelo Post
configurarHooksBitacora(Post, 'Post', {
  criticidad: nivelesCriticidad.contenido, // Operaciones de posts son de contenido
  registrarCreacion: true,
  registrarModificacion: true,
  registrarBorrado: true
});

module.exports = {
  Post
};