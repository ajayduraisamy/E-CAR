// routes/paymentRoutes.js
// Payment API for simulated order payment.
const express = require('express');
const { payOrder } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
const router = express.Router();

// Simulate order payment
router.post('/pay', authMiddleware, payOrder);

// Note: In a real application, this route would integrate with a payment gateway like Stripe or PayPal. Here, it simply simulates payment processing.
module.exports = router;

