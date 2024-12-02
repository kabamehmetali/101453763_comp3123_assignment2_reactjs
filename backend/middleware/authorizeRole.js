// middleware/authorizeRole.js

/**
 * Role Authorization Middleware
 * Checks if the user has the required role to access a route.
 *
 * @param   {...string}  allowedRoles  Roles that are permitted to access the route
 * @returns {Function}   Middleware function
 */
module.exports = (...allowedRoles) => {
    return (req, res, next) => {
      // Check if user's roles are included in the allowed roles
      if (!req.user || !allowedRoles.includes(req.user.roles[0])) {
        return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
      }
  
      // Proceed to the next middleware or route handler
      next();
    };
  };
  