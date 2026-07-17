const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');

router.get('/', dishController.getAllDishes);
router.get('/:id', dishController.getById);
router.post('/', dishController.create);
router.put('/:id', dishController.update);
router.delete('/:id', dishController.delete);

module.exports = router;
