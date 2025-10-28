module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Post', {
    autorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dvh: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fechaPublicacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    modelName: 'Post'
  });
};
