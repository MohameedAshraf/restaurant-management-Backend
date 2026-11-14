const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      unique: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Restaurant owner is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    cuisine: {
      type: [String],
      required: [true, 'Cuisine is required'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'At least one cuisine type is required',
      },
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    openingHours: {
      type: Object,
      default: {},
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: 'default-restaurant.jpg',
    },
  },
  { timestamps: true }
);

restaurantSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
