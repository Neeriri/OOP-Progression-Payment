const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Category = require('./category');

const Dish = sequelize.define('Dish', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  weight_grams: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'dishes',
  timestamps: false,  
  underscored: true
});
Category.hasMany(Dish, { foreignKey: 'category_id', as: 'dishes' });
Dish.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

module.exports = Dish;