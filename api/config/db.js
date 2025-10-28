const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const DB_NAME = process.env.DB_NAME || 'paulinacultiva';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_DIALECT = 'mysql';

async function initDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      multipleStatements: true
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`
    );

    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
      host: DB_HOST,
      dialect: DB_DIALECT,
      logging: false,
      define: {
        timestamps: true,
        underscored: false
      }
    });

    await sequelize.authenticate();

    return sequelize;
  } catch (err) {
    console.error('initDatabase error:', err);
    throw err;
  } finally {
    if (connection) await connection.end();
  }
}

async function ensureTables(modelsObj, sequelize) {
  const qi = sequelize.getQueryInterface();
  const models = Object.entries(modelsObj).filter(([k, v]) => typeof v === 'function' || (v && v.name));

  for (const [name, model] of models) {
    try {
      const tableName = model.getTableName ? model.getTableName() : model.tableName || name;
      await qi.describeTable(tableName);
      console.log(`Tabla existente: ${tableName}`);
    } catch (err) {
      try {
        console.log(`Tabla no encontrada. Creando: ${name}`);
        await model.sync({ alter: false });
        console.log(`Tabla creada: ${name}`);
      } catch (err2) {
        console.error(`Error creando tabla ${name}:`, err2);
        throw err2;
      }
    }
  }
}

module.exports = { initDatabase, ensureTables };
