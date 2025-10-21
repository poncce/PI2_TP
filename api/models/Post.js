const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');

const Post = sequelize.define('Post' , {
    autorId: { // como poner foreign key, seria el id del usuario
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    fechaPublicacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    
}, {
    timestamps: false,
    modelName: 'Post'
});

    module.exports = {
        Post
    };