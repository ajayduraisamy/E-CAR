// models/Order.js
// Order model for storing user purchase intent and payment status.
const mongoose = require('mongoose');

// Order schema with references to User, Car, and Listing, plus payment details.
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      default: null
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending'
    },
    payment_method: {
      type: String,
      enum: ['card', 'upi'],
      default: undefined
    }
  },
  {
    timestamps: true
  }

  
);

// Export the Order model for use in controllers and routes.
module.exports = mongoose.model('Order', orderSchema);

