const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './ecommerce.sqlite',
  logging: false,
});

module.exports = sequelize; 