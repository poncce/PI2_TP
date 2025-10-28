module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Bitacora', {
    accion: DataTypes.STRING,
    entidad: DataTypes.STRING,
    entidad_id: DataTypes.STRING,
    usuario_id: DataTypes.INTEGER,
    antes: DataTypes.JSON,
    despues: DataTypes.JSON,
    criticidad: DataTypes.INTEGER,
    ip: DataTypes.STRING,
    user_agent: DataTypes.STRING
  }, {
    timestamps: true,
    modelName: 'Bitacora',
    tableName: 'bitacora',
    underscored: true
  });
};
