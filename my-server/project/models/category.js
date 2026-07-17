const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'categories',
  timestamps: false,  
  underscored: true
});

module.exports = Category;