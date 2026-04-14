// models/Payment.js
// Payment model for simulated payment records.
const mongoose = require('mongoose');

// Payment schema with reference to Order and User, plus payment details.
const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['card', 'upi'],
      required: true
    },
    card_last4: {
      type: String,
      default: null
    },
    upi_id: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success'
    },
    transaction_id: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

// Export the Payment model for use in controllers and routes.
module.exports = mongoose.model('Payment', paymentSchema);

