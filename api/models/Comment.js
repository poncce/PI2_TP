const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');

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
})

    module.exports = {
        Comment
    }