require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./models/db');
require('./models/dish');
const Category = require('./models/category');
const Dish = require('./models/dish');
const dishController = require('./controllers/dishController');
const categoryRoutes = require('./routes/categoryRoutes');
const dishRoutes = require('./routes/dishRoutes');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/categories', categoryRoutes);
app.use('/api/dishes', dishRoutes);

app.get('/api/menu', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{
        model: Dish,
        as: 'dishes',
        attributes: ['id', 'name', 'price', 'weight_grams']
      }],
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/order', dishController.getOrder);

sequelize.sync()
  .then(() => {
    console.log('Подключение к базе данных установлено успешно.');
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);

    });
  })
  .catch(err => {
    console.error('Ошибка подключения к БД:', err);
    process.exit(1);
  });
