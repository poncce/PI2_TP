const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');

const User = sequelize.define('Usuario', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'activo'
  },
  dvh: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = {
  User
};