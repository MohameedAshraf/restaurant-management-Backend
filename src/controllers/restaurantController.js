const Restaurant = require('../models/Restaurant');
const Meal = require('../models/Meal');
const { ROLES } = require('../utils/constants');

// GET /api/restaurants
const getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true }).populate(
      'owner',
      'name email'
    );
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/restaurants/:id
const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      'owner',
      'name email'
    );

    if (!restaurant) {
      const error = new Error('Restaurant not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/restaurants/:id/meals
const getRestaurantMeals = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      const error = new Error('Restaurant not found');
      error.statusCode = 404;
      return next(error);
    }

    const meals = await Meal.find({ restaurant: req.params.id });
    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/restaurants
const createRestaurant = async (req, res, next) => {
  try {
    req.body.owner = req.user._id;
    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/restaurants/:id
const updateRestaurant = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      const error = new Error('Restaurant not found');
      error.statusCode = 404;
      return next(error);
    }

    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== ROLES.ADMIN
    ) {
      const error = new Error('Not authorized to update this restaurant');
      error.statusCode = 403;
      return next(error);
    }

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/restaurants/:id
const deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      const error = new Error('Restaurant not found');
      error.statusCode = 404;
      return next(error);
    }

    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== ROLES.ADMIN
    ) {
      const error = new Error('Not authorized to delete this restaurant');
      error.statusCode = 403;
      return next(error);
    }

    await Meal.deleteMany({ restaurant: restaurant._id });
    await restaurant.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Restaurant and its meals deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/restaurants/owner/my-restaurants
const getMyRestaurants = async (req, res, next) => {
  try {
    const query =
      req.user.role === ROLES.ADMIN ? {} : { owner: req.user._id };
    const restaurants = await Restaurant.find(query);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantMeals,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurants,
};
