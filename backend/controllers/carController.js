// controllers/carController.js
// Handles car creation, listing, details, deletion, and comparison.
const mongoose = require('mongoose');
const Car = require('../models/Car');

// Create a new car listing.
const createCar = async (req, res) => {
  try {
    const imagePath = req.file
      ? `uploads/${req.file.filename}`
      : req.body.image || '';

    const carData = {
      ...req.body,
      image: imagePath
    };
// Convert string booleans to actual booleans
    const car = await Car.create(carData);
    return res.status(201).json(car);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Server error while creating car.' });
  }
};

// Get all cars with basic details for listing.
const getCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching cars.' });
  }
};

// Get detailed information about a specific car by ID.
const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid car ID.' });
    }
// Find the car by ID and return its details.
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }

    return res.status(200).json(car);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching car details.' });
  }
};

// Delete a car listing by ID.
const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid car ID.' });
    }

    // Find the car by ID and delete it.
    const deletedCar = await Car.findByIdAndDelete(id);
    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found.' });
    }

    return res.status(200).json({ message: 'Car deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while deleting car.' });
  }
};

const updateCar = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid car ID.' });
    }

    const updateData = { ...req.body };
    
    // Handle image upload
    if (req.file) {
      updateData.image = `uploads/${req.file.filename}`;
    }

    // Convert string booleans to actual booleans
    if (updateData.abs !== undefined) {
      updateData.abs = updateData.abs === 'true' || updateData.abs === true;
    }
    if (updateData.sunroof !== undefined) {
      updateData.sunroof = updateData.sunroof === 'true' || updateData.sunroof === true;
    }
    if (updateData.gps !== undefined) {
      updateData.gps = updateData.gps === 'true' || updateData.gps === true;
    }

    const updatedCar = await Car.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found.' });
    }

    return res.status(200).json(updatedCar);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Server error while updating car.' });
  }
};

// Helper function to determine which car is better based on a specific field and preference.
const getBetterCar = (car1, car2, field, preference) => {
  if (car1[field] === car2[field]) return 'tie';

  if (preference === 'lower') {
    return car1[field] < car2[field] ? car1.name : car2.name;
  }

  return car1[field] > car2[field] ? car1.name : car2.name;
};

// Compare two cars based on key performance metrics and return a summary.
const compareCars = async (req, res) => {
  try {
    const { id1, id2 } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id1) || !mongoose.Types.ObjectId.isValid(id2)) {
      return res.status(400).json({ message: 'Invalid car IDs.' });
    }

    const [car1, car2] = await Promise.all([Car.findById(id1), Car.findById(id2)]);

    if (!car1 || !car2) {
      return res.status(404).json({ message: 'One or both cars not found.' });
    }
// Define the comparison criteria and determine which car performs better in each category.
    const comparison = {
      price: {
        better: getBetterCar(car1, car2, 'price', 'lower'),
        car1: car1.price,
        car2: car2.price
      },
      horsepower: {
        better: getBetterCar(car1, car2, 'horsepower', 'higher'),
        car1: car1.horsepower,
        car2: car2.horsepower
      },
      mileage: {
        better: getBetterCar(car1, car2, 'mileage', 'higher'),
        car1: car1.mileage,
        car2: car2.mileage
      },
      top_speed: {
        better: getBetterCar(car1, car2, 'top_speed', 'higher'),
        car1: car1.top_speed,
        car2: car2.top_speed
      }
    };
// Count how many categories each car wins to determine an overall better performer.
    const winCount = {
      [car1.name]: 0,
      [car2.name]: 0
    };

    Object.values(comparison).forEach((item) => {
      if (item.better !== 'tie') {
        winCount[item.better] += 1;
      }
    });

    // Generate a summary based on which car performs better in more categories.
    let summary = 'Both cars are equally matched.';
    if (winCount[car1.name] > winCount[car2.name]) {
      summary = `${car1.name} performs better in more categories than ${car2.name}.`;
    } else if (winCount[car2.name] > winCount[car1.name]) {
      summary = `${car2.name} performs better in more categories than ${car1.name}.`;
    }

    
    return res.status(200).json({
     cars: [
  {
    _id: car1._id,
    name: car1.name,
    brand: car1.brand,
    price: car1.price,
    image: car1.image
  },
  {
    _id: car2._id,
    name: car2.name,
    brand: car2.brand,
    price: car2.price,
    image: car2.image
  }
],
      comparison,
      summary
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while comparing cars.' });
  }
};

// Export the controller functions for use in routes.
module.exports = {
  createCar,
  getCars,
  getCarById,
  deleteCar,
  updateCar,
  compareCars
};
