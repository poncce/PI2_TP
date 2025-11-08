const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { configurarHooksBitacora, nivelesCriticidad } = require('./hooks/bitacora');

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
  timestamps: true
});

// Configurar hooks de bitácora para el modelo Friendship
configurarHooksBitacora(Friendship, 'Friendship', {
  criticidad: nivelesCriticidad.administracion, // Operaciones de amistad son administrativas
  registrarCreacion: true,
  registrarModificacion: true,
  registrarBorrado: true
});

module.exports = {
  Friendship
};