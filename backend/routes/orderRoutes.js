// routes/orderRoutes.js
// Order APIs for create order and user's order history.
const express = require('express');
const { createOrder, getUserOrders, getAllOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getUserOrders);
router.get('/', authMiddleware, adminMiddleware, getAllOrders);

module.exports = router;

