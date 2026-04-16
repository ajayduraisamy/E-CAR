// routes/carRoutes.js
// Car APIs including admin operations and car comparison.
const express = require('express');
const {
  createCar,
  getCars,
  getCarById,
  deleteCar,
  updateCar,
  compareCars
} = require('../controllers/carController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes are protected and require admin access for modifications.
const router = express.Router();

// Car routes
router.get('/', getCars);
router.get('/compare/:id1/:id2', compareCars);
router.get('/:id', getCarById);
router.post('/', authMiddleware, adminMiddleware, upload.array('images', 4), createCar);

router.put('/:id', authMiddleware, adminMiddleware, upload.array('images', 4), updateCar);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCar);

// Note: No public POST/PUT/DELETE routes for cars, only admins can modify car data.
module.exports = router;

