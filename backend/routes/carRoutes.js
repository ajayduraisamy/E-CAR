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

const router = express.Router();

router.get('/', getCars);
router.get('/compare/:id1/:id2', compareCars);
router.get('/:id', getCarById);
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createCar);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateCar);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCar);

module.exports = router;

