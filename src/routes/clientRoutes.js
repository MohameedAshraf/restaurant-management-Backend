const express = require('express');
const router = express.Router();
const {
  getMealsWithAdvancedFilters,
  getRestaurantsWithFilters,
  getRestaurantWithMeals,
  getCategories,
} = require('../controllers/clientController');
const { protect, authorize } = require('../middlewares/auth');
const { ROLES } = require('../utils/constants');

router.use(protect, authorize(ROLES.CLIENT));

router.get('/meals', getMealsWithAdvancedFilters);
router.get('/restaurants', getRestaurantsWithFilters);
router.get('/restaurants/:id', getRestaurantWithMeals);
router.get('/categories', getCategories);

module.exports = router;
