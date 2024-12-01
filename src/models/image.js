const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const { v4: uuidv4 } = require('uuid');

const Image = sequelize.define('td_images', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => uuidv4() 
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  suffix: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Image;