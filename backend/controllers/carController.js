// controllers/carController.js
// Handles car creation, listing, details, deletion, and comparison.
const mongoose = require('mongoose');
const Car = require('../models/Car');

const createCar = async (req, res) => {
  try {
    const imagePath = req.file
      ? `uploads/${req.file.filename}`
      : req.body.image || '';

    const carData = {
      ...req.body,
      image: imagePath
    };

    const car = await Car.create(carData);
    return res.status(201).json(car);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Server error while creating car.' });
  }
};

const getCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching cars.' });
  }
};

const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid car ID.' });
    }

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }

    return res.status(200).json(car);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching car details.' });
  }
};

const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid car ID.' });
    }

    const deletedCar = await Car.findByIdAndDelete(id);
    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found.' });
    }

    return res.status(200).json({ message: 'Car deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while deleting car.' });
  }
};

const getBetterCar = (car1, car2, field, preference) => {
  if (car1[field] === car2[field]) return 'tie';

  if (preference === 'lower') {
    return car1[field] < car2[field] ? car1.name : car2.name;
  }

  return car1[field] > car2[field] ? car1.name : car2.name;
};

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

    const winCount = {
      [car1.name]: 0,
      [car2.name]: 0
    };

    Object.values(comparison).forEach((item) => {
      if (item.better !== 'tie') {
        winCount[item.better] += 1;
      }
    });

    let summary = 'Both cars are equally matched.';
    if (winCount[car1.name] > winCount[car2.name]) {
      summary = `${car1.name} performs better in more categories than ${car2.name}.`;
    } else if (winCount[car2.name] > winCount[car1.name]) {
      summary = `${car2.name} performs better in more categories than ${car1.name}.`;
    }

    return res.status(200).json({
      cars: [
        {
          id: car1._id,
          name: car1.name,
          brand: car1.brand
        },
        {
          id: car2._id,
          name: car2.name,
          brand: car2.brand
        }
      ],
      comparison,
      summary
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while comparing cars.' });
  }
};

module.exports = {
  createCar,
  getCars,
  getCarById,
  deleteCar,
  compareCars
};
