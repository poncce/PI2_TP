module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Comentario', {
    PostId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    autorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fechaComentario: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    dvh: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    timestamps: false,
    modelName: 'Comentario'
  });
};
