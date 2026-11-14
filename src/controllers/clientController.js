const Restaurant = require('../models/Restaurant');
const Meal = require('../models/Meal');
const { MEAL_CATEGORIES } = require('../utils/constants');

// GET /api/client/meals
const getMealsWithAdvancedFilters = async (req, res, next) => {
  try {
    const {
      search,
      category,
      restaurant,
      minPrice,
      maxPrice,
      isVegetarian,
      isVegan,
      isGlutenFree,
      isSpicy,
    } = req.query;

    const filter = { isAvailable: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = category;
    if (restaurant) filter.restaurant = restaurant;
    if (isVegetarian !== undefined) filter.isVegetarian = isVegetarian === 'true';
    if (isVegan !== undefined) filter.isVegan = isVegan === 'true';
    if (isGlutenFree !== undefined) filter.isGlutenFree = isGlutenFree === 'true';
    if (isSpicy !== undefined) filter.isSpicy = isSpicy === 'true';

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    const meals = await Meal.find(filter).populate('restaurant', 'name address rating');

    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/client/restaurants
const getRestaurantsWithFilters = async (req, res, next) => {
  try {
    const { search, city, cuisine } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (city) {
      filter['address.city'] = { $regex: city, $options: 'i' };
    }

    if (cuisine) {
      filter.cuisine = { $in: [new RegExp(cuisine, 'i')] };
    }

    const restaurants = await Restaurant.find(filter);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/client/restaurants/:id
const getRestaurantWithMeals = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!restaurant) {
      const error = new Error('Restaurant not found');
      error.statusCode = 404;
      return next(error);
    }

    const meals = await Meal.find({
      restaurant: restaurant._id,
      isAvailable: true,
    });

    res.status(200).json({
      success: true,
      data: {
        restaurant,
        meals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/client/categories
const getCategories = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: MEAL_CATEGORIES,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMealsWithAdvancedFilters,
  getRestaurantsWithFilters,
  getRestaurantWithMeals,
  getCategories,
};
