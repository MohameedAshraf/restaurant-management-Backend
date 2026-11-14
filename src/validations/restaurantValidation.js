const Joi = require('joi');

const timeFormat = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

const dayHoursSchema = Joi.object({
  open: Joi.string().pattern(timeFormat).required(),
  close: Joi.string().pattern(timeFormat).required(),
});

const createRestaurantSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  cuisine: Joi.array().items(Joi.string()).min(1).required(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  contact: Joi.object({
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
  }).required(),
  openingHours: Joi.object()
    .pattern(
      Joi.string().valid(
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
      ),
      dayHoursSchema
    )
    .optional(),
  rating: Joi.number().min(0).max(5).optional(),
  isActive: Joi.boolean().optional(),
  image: Joi.string().optional(),
});

const updateRestaurantSchema = createRestaurantSchema.fork(
  ['name', 'description', 'cuisine', 'address', 'contact'],
  (schema) => schema.optional()
);

module.exports = {
  createRestaurantSchema,
  updateRestaurantSchema,
};
