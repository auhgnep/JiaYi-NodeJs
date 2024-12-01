const { Sequelize } = require('sequelize');
const config = require('config');

const sequelize = new Sequelize(
  config.data.database, 
  config.data.username, 
  config.data.password, 
  {
    host: config.data.host,
    dialect: config.data.dialect
  }
);

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync();
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

module.exports = {
  sequelize,
  initializeDatabase
};