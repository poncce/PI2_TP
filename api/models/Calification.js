const { sequelize } = require("../config/db");
const { DataTypes } = require('sequelize');

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
    timestamps: false,
    modelName: 'Calificacion'
});

    module.exports = {
        Calification
    };