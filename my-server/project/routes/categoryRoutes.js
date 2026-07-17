const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Dish = require('../models/dish');

// GET / — все категории с блюдами
router.get('/', async (req, res) => {
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

// GET /:id — категория по id
// ВАЖНО: этот маршрут должен быть ПОСЛЕ всех конкретных маршрутов
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{
        model: Dish,
        as: 'dishes'
      }]
    });

    if (!category) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST / — создать категорию
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Название категории обязательно' });
    }

    const category = await Category.create({ name: name.trim() });
    res.status(201).json(category);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Категория с таким названием уже существует' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /:id — обновить категорию
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }

    if (name && name.trim() !== '') {
      category.name = name.trim();
      await category.save();
    }

    res.json(category);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Категория с таким названием уже существует' });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /:id — удалить категорию
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }

    const dishesCount = await Dish.count({ where: { category_id: category.id } });
    if (dishesCount > 0) {
      return res.status(400).json({
        error: `Невозможно удалить: в категории есть блюда (${dishesCount} шт.)`
      });
    }

    await category.destroy();
    res.json({ message: 'Категория удалена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
