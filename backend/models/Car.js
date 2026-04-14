// models/Car.js
// Car model with detailed specs for management and comparison.
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    // Basic info
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },

    // Engine & performance
    engine: { type: String, required: true, trim: true },
    horsepower: { type: Number, required: true, min: 0 },
    torque: { type: String, required: true, trim: true },
    mileage: { type: Number, required: true, min: 0 },
    top_speed: { type: Number, required: true, min: 0 },

    // Fuel & transmission
    fuel_type: { type: String, required: true, trim: true },
    transmission: { type: String, required: true, trim: true },

    // Dimensions
    seating_capacity: { type: Number, required: true, min: 1 },
    boot_space: { type: Number, required: true, min: 0 },
    fuel_tank_capacity: { type: Number, required: true, min: 0 },

    // Features
    airbags: { type: Number, required: true, min: 0 },
    abs: { type: Boolean, default: false },
    infotainment_system: { type: String, default: '' },
    sunroof: { type: Boolean, default: false },
    gps: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

// Export the Car model
module.exports = mongoose.model('Car', carSchema);

