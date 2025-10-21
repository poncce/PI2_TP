const { DESCRIBE } = require("sequelize/lib/query-types");
const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');

const Permission = sequelize.define('Permiso', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tipo: {
        type: DataTypes.STRING
    },
})

    module.exports = {
        Permission
    }