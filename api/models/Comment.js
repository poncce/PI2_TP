const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');
const { configurarHooksBitacora, nivelesCriticidad } = require('./hooks/bitacora');

const Comment = sequelize.define('Comentario', {
    PostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    autorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    fechaComentario: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    tableName: 'Comentarios'
});

// Configurar hooks de bitácora para el modelo Comentario
configurarHooksBitacora(Comment, 'Comentario', {
    criticidad: nivelesCriticidad.contenido, // Operaciones de comentarios son de contenido
    registrarCreacion: true,
    registrarModificacion: true,
    registrarBorrado: true
});

module.exports = {
    Comment
};