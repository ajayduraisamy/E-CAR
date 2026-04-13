// models/Listing.js
// Marketplace listing model for buy/sell posts.
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Listing', listingSchema);

