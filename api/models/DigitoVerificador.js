module.exports = (sequelize, DataTypes) => {
  return sequelize.define('DigitoVerificador', {
    tabla: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    dvv: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    timestamps: false,
    modelName: 'DigitoVerificador',
    tableName: 'digito_verificador'
  });
};
