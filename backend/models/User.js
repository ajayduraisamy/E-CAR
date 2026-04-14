// models/User.js
// User model for authentication and role-based access.
const mongoose = require('mongoose');

// User schema with name, email, password, and role (user/admin).
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true
  }
);
// Export the User model for use in authentication and authorization.
module.exports = mongoose.model('User', userSchema);

