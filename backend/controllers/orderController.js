// controllers/orderController.js
// Handles order creation and fetching logged-in user orders.
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Car = require('../models/Car');
const Listing = require('../models/Listing');

// Create a new order for a car or listing
const createOrder = async (req, res) => {
  try {
    const { car, carId, listing, listingId, amount } = req.body;

    // Support both car & listing orders
    const finalCarId = car || carId;
    const finalListingId = listing || listingId;

    if (!finalCarId && !finalListingId) {
      return res.status(400).json({ message: 'Car ID or Listing ID is required.' });
    }

    // Validate car and listing existence if IDs are provided
    let carExists = null;
    let listingExists = null;
    if (finalCarId) {
      if (!mongoose.Types.ObjectId.isValid(finalCarId)) {
        return res.status(400).json({ message: 'Invalid car ID.' });
      }
      carExists = await Car.findById(finalCarId);
      if (!carExists) {
        return res.status(404).json({ message: 'Car not found.' });
      }
    }
    if (finalListingId) {
      if (!mongoose.Types.ObjectId.isValid(finalListingId)) {
        return res.status(400).json({ message: 'Invalid listing ID.' });
      }
      listingExists = await Listing.findById(finalListingId);
      if (!listingExists) {
        return res.status(404).json({ message: 'Listing not found.' });
      }
    }

    // Validate amount
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Valid amount is required.' });
    }
// Create the order
    const order = await Order.create({
      user: req.user.id,
      car: finalCarId || null,
      listing: finalListingId || null,
      amount: Number(amount),
      status: 'pending'
    });

    return res.status(201).json({
      message: 'Order created successfully.',
      order
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error while creating order.' });
  }
};

// Get orders for the logged-in user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('car', 'name brand price image')
      .populate('listing', 'title price description image location contact')
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching orders.' });
  }
};


// Get all orders (admin route)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('car', 'name brand price image')
      .populate('listing', 'title price description image location contact')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching all orders.' });
  }
};

// Admin can update order status (not implemented here, but can be added similarly to marketController's updateListing)
module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders
};

