// routes/orderRoutes.js
// Order APIs for create order and user's order history.
const express = require('express');
const { createOrder, getUserOrders, getAllOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// All routes require authentication
const router = express.Router();

// Create a new order

router.post('/', authMiddleware, createOrder);
// Get orders for logged-in user
router.get('/my', authMiddleware, getUserOrders);
// Get all orders (admin only)
router.get('/', authMiddleware, adminMiddleware, getAllOrders);

// Note: The getAllOrders route is protected by both authMiddleware and adminMiddleware to ensure only authenticated admins can access it.
module.exports = router;

