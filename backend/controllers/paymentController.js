// controllers/paymentController.js
// Handles simulated payment and updates order status.
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

const generateTransactionId = () => {
  return `TXN_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
};

const payOrder = async (req, res) => {
  try {
    const { orderId, amount, method, card_last4, upi_id } = req.body;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Valid orderId is required.' });
    }

    if (amount === undefined || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Valid amount is required.' });
    }

    if (!method || !['card', 'upi'].includes(method)) {
      return res.status(400).json({ message: 'method must be card or upi.' });
    }

    if (method === 'card') {
      if (!card_last4 || !/^\d{4}$/.test(String(card_last4))) {
        return res.status(400).json({ message: 'card_last4 must be exactly 4 digits.' });
      }
    }

    if (method === 'upi' && !upi_id) {
      return res.status(400).json({ message: 'upi_id is required for UPI payments.' });
    }

    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found for this user.' });
    }

    if (order.status === 'paid') {
      return res.status(400).json({ message: 'This order is already paid.' });
    }

    if (Number(amount) !== Number(order.amount)) {
      return res.status(400).json({ message: 'Payment amount must match order amount.' });
    }

    const payment = await Payment.create({
      order: order._id,
      user: req.user.id,
      amount: Number(amount),
      method,
      card_last4: method === 'card' ? String(card_last4) : null,
      upi_id: method === 'upi' ? upi_id : null,
      status: 'success',
      transaction_id: generateTransactionId()
    });

    order.status = 'paid';
    order.payment_method = method;
    await order.save();

    return res.status(200).json({
      message: 'Payment successful. Order marked as paid.',
      payment,
      order
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while processing payment.' });
  }
};

module.exports = {
  payOrder
};

