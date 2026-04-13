// controllers/marketController.js
// Handles marketplace listing creation and retrieval.
const Listing = require('../models/Listing');

const createListing = async (req, res) => {
  try {
    const { title, price, description, contact, location } = req.body;

    if (!title || !price || !description || !contact || !location) {
      return res.status(400).json({
        message: 'title, price, description, contact and location are required.'
      });
    }

    const imagePath = req.file
      ? `uploads/${req.file.filename}`
      : req.body.image || '';

    const listing = await Listing.create({
      title,
      price,
      description,
      contact,
      location,
      image: imagePath,
      user: req.user.id
    });

    return res.status(201).json(listing);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Server error while creating listing.' });
  }
};

const getListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json(listings);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching listings.' });
  }
};

const getUserListings = async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(listings);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching user listings.' });
  }
};

module.exports = {
  createListing,
  getListings,
  getUserListings
};

