const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');
const { configurarHooksBitacora, nivelesCriticidad } = require('./hooks/bitacora');

const Calification = sequelize.define('Calificacion', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    }
}, {
    timestamps: true,
    modelName: 'Calificacion'
});

// Configurar hooks de bitácora para el modelo Calificacion
configurarHooksBitacora(Calification, 'Calificacion', {
    criticidad: nivelesCriticidad.contenido, // Operaciones de calificación son de contenido
    registrarCreacion: true,
    registrarModificacion: true,
    registrarBorrado: true
});

module.exports = {
    Calification
};