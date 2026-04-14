// middleware/adminMiddleware.js
// Allows access only to admin users.
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  next();
};

// Usage: Apply this middleware to routes that require admin access, e.g.:

module.exports = adminMiddleware;

