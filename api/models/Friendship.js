const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Friendship = sequelize.define('Friendship', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  friendId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  friendUsername: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stateRequest: {
    type: DataTypes.ENUM('pendiente', 'aceptado', 'rechazado'),
    defaultValue: 'pendiente',
    allowNull: false,
  },
  friendShipId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: false
});

module.exports = {
  Friendship
};
