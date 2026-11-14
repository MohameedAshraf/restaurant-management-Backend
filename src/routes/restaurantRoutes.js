const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantMeals,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurants,
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
const {
  createRestaurantSchema,
  updateRestaurantSchema,
} = require('../validations/restaurantValidation');
const { ROLES } = require('../utils/constants');

router.get(
  '/owner/my-restaurants',
  protect,
  authorize(ROLES.RESTAURANT_OWNER, ROLES.ADMIN),
  getMyRestaurants
);

router
  .route('/')
  .get(getAllRestaurants)
  .post(
    protect,
    authorize(ROLES.RESTAURANT_OWNER, ROLES.ADMIN),
    validate(createRestaurantSchema),
    createRestaurant
  );

router
  .route('/:id')
  .get(getRestaurantById)
  .put(
    protect,
    authorize(ROLES.RESTAURANT_OWNER, ROLES.ADMIN),
    validate(updateRestaurantSchema),
    updateRestaurant
  )
  .delete(
    protect,
    authorize(ROLES.RESTAURANT_OWNER, ROLES.ADMIN),
    deleteRestaurant
  );

router.get('/:id/meals', getRestaurantMeals);

module.exports = router;
