// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user information to the request object.
 *
 * @param   {Object}   req   Express request object
 * @param   {Object}   res   Express response object
 * @param   {Function} next  Express next middleware function
 */
module.exports = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.headers['authorization'];

  // Check if the token is provided
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token provided, authorization denied' });
  }

  // Split the 'Bearer' prefix and get the token
  const token = authHeader.split(' ')[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ msg: 'Invalid token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = decoded.user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
