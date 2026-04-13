// routes/paymentRoutes.js
// Payment API for simulated order payment.
const express = require('express');
const { payOrder } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/pay', authMiddleware, payOrder);

module.exports = router;

