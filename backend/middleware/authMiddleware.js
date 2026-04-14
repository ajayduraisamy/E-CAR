// middleware/authMiddleware.js
// Verifies JWT token and attaches user payload to req.user.
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Expecting Authorization header in format
    const authHeader = req.headers.authorization;
   
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. Token missing.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;

