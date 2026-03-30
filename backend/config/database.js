const { Sequelize } = require('sequelize');
const path = require('path');

const storagePath = path.join(__dirname, '..', 'taskmanager.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false, // Disable SQL logging for cleaner terminal output
});

module.exports = sequelize;
