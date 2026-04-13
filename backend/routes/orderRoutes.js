// routes/orderRoutes.js
// Order APIs for create order and user's order history.
const express = require('express');
const { createOrder, getUserOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, createOrder);
router.get('/user', authMiddleware, getUserOrders);

module.exports = router;

