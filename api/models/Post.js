const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');

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
    type: DataTypes.STRING,
    allowNull: false
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dvh: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fechaPublicacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

module.exports = {
  Post
};