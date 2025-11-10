// models/index.js
const { User } = require('./User');
const { Post } = require('./Post');
const { Comment } = require('./Comment');
const { Friendship } = require('./Friendship');
const { Calification } = require('./Calification');
const { Permiso } = require('./Permission');
const { Bitacora } = require('./Bitacora');
const { DigitoVerificador } = require('./DigitoVerificador');

// Importar todos los modelos para que se definan
const models = {
  User,
  Post,
  Comment,
  Friendship,
  Calification,
  Permiso,
  Bitacora,
  DigitoVerificador
};

// Exportar todos los modelos
module.exports = {
  ...models,
  sequelize: require('../config/db').sequelize
};