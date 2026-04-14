// config/db.js
// MongoDB connection setup using Mongoose.
const mongoose = require('mongoose');

// Connect to MongoDB using the connection string from environment variables.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Export the connectDB function for use in server.js.
module.exports = connectDB;

