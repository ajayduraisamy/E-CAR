// models/Order.js
// Order model for storing user purchase intent and payment status.
const mongoose = require('mongoose');

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

module.exports = mongoose.model('Order', orderSchema);

