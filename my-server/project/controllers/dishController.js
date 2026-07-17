const Dish = require('../models/dish');

exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.findAll({ order: [['id', 'ASC']] });
    res.status(200).json(dishes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id);
    if (!dish) {
      return res.status(404).json({ error: 'Блюдо не найдено' });
    }
    res.status(200).json(dish);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, price, weight_grams, category_id } = req.body;

    if (!name || !price || !weight_grams) {
      return res.status(400).json({
        error: 'Поля name, price и weight_grams обязательны'
      });
    }

    const dish = await Dish.create({ name, price, weight_grams, category_id });
    res.status(201).json(dish);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, weight_grams, category_id } = req.body;

    const dish = await Dish.findByPk(id);
    if (!dish) {
      return res.status(404).json({ error: 'Блюдо не найдено' });
    }

    await dish.update({ name, price, weight_grams, category_id });
    res.status(200).json(dish);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const dish = await Dish.findByPk(id);
    if (!dish) {
      return res.status(404).json({ error: 'Блюдо не найдено' });
    }

    await dish.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// JSON API для оформления заказа (вместо HTML-ответа)
exports.getOrder = async (req, res) => {
  try {
    let dishIds = [];
    if (req.body.dishIds) {
      // Поддержка и строки "1,2,3" и массива [1,2,3]
      if (typeof req.body.dishIds === 'string') {
        dishIds = req.body.dishIds.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
      } else if (Array.isArray(req.body.dishIds)) {
        dishIds = req.body.dishIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
      }
    }

    if (dishIds.length === 0) {
      return res.status(400).json({ error: 'Не выбрано ни одного блюда' });
    }

    const dishes = await Dish.findAll({ where: { id: dishIds } });
    const total = dishes.reduce((sum, d) => sum + parseFloat(d.price), 0);

    res.status(201).json({
      message: 'Заказ принят',
      items: dishes.map(d => ({ id: d.id, name: d.name, price: d.price })),
      total: parseFloat(total.toFixed(2))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
