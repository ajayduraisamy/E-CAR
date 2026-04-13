// controllers/orderController.js
// Handles order creation and fetching logged-in user orders.
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Car = require('../models/Car');

const createOrder = async (req, res) => {
  try {
    const { car, amount } = req.body;

    if (amount === undefined || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Valid amount is required.' });
    }

    if (car) {
      if (!mongoose.Types.ObjectId.isValid(car)) {
        return res.status(400).json({ message: 'Invalid car ID.' });
      }

      const carExists = await Car.findById(car);
      if (!carExists) {
        return res.status(404).json({ message: 'Car not found.' });
      }
    }

    const order = await Order.create({
      user: req.user.id,
      car: car || null,
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

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('car', 'name brand price image')
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching orders.' });
  }
};

module.exports = {
  createOrder,
  getUserOrders
};

