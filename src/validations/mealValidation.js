const Joi = require('joi');
const { MEAL_CATEGORIES } = require('../utils/constants');

const createMealSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  restaurant: Joi.string().hex().length(24).required(),
  description: Joi.string().min(5).max(500).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string()
    .valid(...MEAL_CATEGORIES)
    .required(),
  ingredients: Joi.array().items(Joi.string()).min(1).required(),
  calories: Joi.number().min(0).optional(),
  isVegetarian: Joi.boolean().optional(),
  isVegan: Joi.boolean().optional(),
  isGlutenFree: Joi.boolean().optional(),
  isSpicy: Joi.boolean().optional(),
  preparationTime: Joi.number().min(0).required(),
  isAvailable: Joi.boolean().optional(),
  image: Joi.string().optional(),
});

const updateMealSchema = createMealSchema.fork(
  ['name', 'restaurant', 'description', 'price', 'category', 'ingredients', 'preparationTime'],
  (schema) => schema.optional()
);

module.exports = {
  createMealSchema,
  updateMealSchema,
};
