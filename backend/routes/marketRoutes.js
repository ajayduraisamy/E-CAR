// routes/marketRoutes.js
// Marketplace listing routes with image upload support.
const express = require('express');
const {
  createListing,
  getListings,
  getUserListings,
  updateListing
} = require('../controllers/marketController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();


// Create listing
router.post('/', authMiddleware, upload.single('image'), createListing);
// Get all listings
router.get('/', getListings);
// Get listings for logged-in user
router.get('/user', authMiddleware, getUserListings);
// Update listing (only by owner)
router.put('/:id', authMiddleware, upload.single('image'), updateListing);

module.exports = router;

