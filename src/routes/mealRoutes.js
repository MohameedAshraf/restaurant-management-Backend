const express = require('express');
const router = express.Router();
const {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
} = require('../controllers/mealController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
const {
  createMealSchema,
  updateMealSchema,
} = require('../validations/mealValidation');
const { ROLES } = require('../utils/constants');

router
  .route('/')
  .get(getAllMeals)
  .post(
    protect,
    authorize(ROLES.RESTAURANT_OWNER, ROLES.ADMIN),
    validate(createMealSchema),
    createMeal
  );

router
  .route('/:id')
  .get(getMealById)
  .put(
    protect,
    authorize(ROLES.RESTAURANT_OWNER, ROLES.ADMIN),
    validate(updateMealSchema),
    updateMeal
  )
  .delete(
    protect,
    authorize(ROLES.RESTAURANT_OWNER, ROLES.ADMIN),
    deleteMeal
  );

module.exports = router;
