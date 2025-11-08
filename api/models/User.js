// models/User.js
const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');
const { configurarHooksBitacora, nivelesCriticidad } = require('./hooks/bitacora');

const User = sequelize.define('Usuario', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El nombre de usuario no puede estar vacío'
      },
      isValidUsername(value) {
        // Solo letras, números, guiones y guiones bajos
        const regex = /^[a-zA-Z0-9_-]+$/;
        if (!regex.test(value)) {
          throw new Error('El nombre de usuario solo puede contener letras, números, guiones (-) y guiones bajos (_)');
        }
      },
      noSpaces(value) {
        if (/\s/.test(value)) {
          throw new Error('El nombre de usuario no puede contener espacios');
        }
      }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Debe ser un email válido'
      },
      isValidEmail(value) {
        if (value) {
          // Regex basado en las reglas de Gmail/Google:
          // - Letras, números, puntos (.)
          // - Signos + permitidos antes del @
          // - No puede empezar ni terminar con punto
          // - No puede tener puntos consecutivos
          const regex = /^[a-zA-Z0-9]+([._+][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
          if (!regex.test(value)) {
            throw new Error('El email solo puede contener letras, números, puntos (.), guiones bajos (_) y el signo más (+)');
          }
        }
      },
      noSpaces(value) {
        if (value && /\s/.test(value)) {
          throw new Error('El email no puede contener espacios');
        }
      }
    }
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'activo'
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  dvh: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true
});

// Configurar hooks de bitácora para el modelo Usuario
console.log('⚙️ Configurando hooks de bitácora para el modelo Usuario...');
configurarHooksBitacora(User, 'Usuario', {
  criticidad: nivelesCriticidad.seguridad, // Operaciones de usuarios son de seguridad
  registrarCreacion: true,
  registrarModificacion: true,
  registrarBorrado: true
});
console.log('✅ Hooks de bitácora configurados para Usuario');

module.exports = {
  User
};