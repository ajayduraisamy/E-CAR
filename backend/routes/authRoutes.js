// routes/authRoutes.js
// Auth API routes for register and login.
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

// Create a router for authentication routes.
const router = express.Router();

// Define routes for user registration and login.
router.post('/register', registerUser);
router.post('/login', loginUser);

// Export the router to be used in the main app.
module.exports = router;

