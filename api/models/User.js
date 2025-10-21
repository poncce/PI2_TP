    const { sequelize } = require("../config/db");
    const { DataTypes } = require('sequelize');

const User = sequelize.define('Usuario', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {  
        type: DataTypes.BOOLEAN,
        defaultValue: false  
    },
    estado: {
        type: DataTypes.ENUM('activo', 'bloqueado', 'inactivo'),
        defaultValue: 'activo',
        allowNull: true
    }
}, {
    timestamps: false,
    modelName: 'Usuario'
},
);


    module.exports = {
        User
    };
