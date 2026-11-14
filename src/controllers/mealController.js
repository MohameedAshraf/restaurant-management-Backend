const Meal = require('../models/Meal');
const Restaurant = require('../models/Restaurant');
const { ROLES } = require('../utils/constants');

// GET /api/meals
const getAllMeals = async (req, res, next) => {
  try {
    const {
      category,
      restaurant,
      minPrice,
      maxPrice,
      isVegetarian,
      isVegan,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (restaurant) filter.restaurant = restaurant;
    if (isVegetarian !== undefined) {
      filter.isVegetarian = isVegetarian === 'true';
    }
    if (isVegan !== undefined) {
      filter.isVegan = isVegan === 'true';
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    const meals = await Meal.find(filter).populate('restaurant', 'name address');

    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/meals/:id
const getMealById = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id).populate(
      'restaurant',
      'name description address contact'
    );

    if (!meal) {
      const error = new Error('Meal not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/meals
const createMeal = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.body.restaurant);

    if (!restaurant) {
      const error = new Error('Restaurant not found');
      error.statusCode = 404;
      return next(error);
    }

    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== ROLES.ADMIN
    ) {
      const error = new Error(
        'Not authorized to add meals to this restaurant'
      );
      error.statusCode = 403;
      return next(error);
    }

    const meal = await Meal.create(req.body);

    res.status(201).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/meals/:id
const updateMeal = async (req, res, next) => {
  try {
    let meal = await Meal.findById(req.params.id).populate('restaurant');

    if (!meal) {
      const error = new Error('Meal not found');
      error.statusCode = 404;
      return next(error);
    }

    if (
      meal.restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== ROLES.ADMIN
    ) {
      const error = new Error('Not authorized to update this meal');
      error.statusCode = 403;
      return next(error);
    }

    meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/meals/:id
const deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id).populate('restaurant');

    if (!meal) {
      const error = new Error('Meal not found');
      error.statusCode = 404;
      return next(error);
    }

    if (
      meal.restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== ROLES.ADMIN
    ) {
      const error = new Error('Not authorized to delete this meal');
      error.statusCode = 403;
      return next(error);
    }

    await meal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Meal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
};
