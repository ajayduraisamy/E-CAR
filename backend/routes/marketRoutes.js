// routes/marketRoutes.js
// Marketplace listing routes with image upload support.
const express = require('express');
const {
  createListing,
  getListings,
  getUserListings
} = require('../controllers/marketController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), createListing);
router.get('/', getListings);
router.get('/user', authMiddleware, getUserListings);

module.exports = router;

