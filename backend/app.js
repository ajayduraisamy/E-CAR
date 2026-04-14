// app.js
// Main Express server file for E-CAR backend.
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

// Load environment variables from .env.
dotenv.config();

// Connect MongoDB.
connectDB();

const app = express();

// Core middleware.
app.use(cors());
app.use(express.json());

// Serve uploaded images as static files.
app.use('/uploads', express.static('uploads'));

// Base health route.
app.get('/', (req, res) => {
  res.send('API is running');
});

// API routes.
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/order', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
// 404 handler.
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// Global error handler.
app.use((err, req, res, next) => {
  if (err && err.message === 'Only image files are allowed.') {
    return res.status(400).json({ message: err.message });
  }

  // Multer file size limit error.
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Image size should be 5MB or less.' });
  }

  // Default to 500 server error for unhandled cases.
  return res.status(500).json({ message: 'Internal server error.' });
});

// Start the server.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
