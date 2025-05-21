const { ApiError } = require('./errorHandler');

/**
 * Middleware to check if user has required role
 * @param {Array|String} roles - Required role(s) to access the route
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(500, 'Authentication middleware must be used before role checking');
      }
      
      // Convert single role to array for uniform handling
      const requiredRoles = Array.isArray(roles) ? roles : [roles];
      
      // Check if user's role is included in the required roles
      if (!requiredRoles.includes(req.user.role)) {
        throw new ApiError(403, 'Access denied. You do not have permission to perform this action');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware specifically for admin routes
 */
const isAdmin = checkRole('ADMIN');

/**
 * Middleware specifically for parking attendant routes
 */
const isAttendant = checkRole(['ADMIN', 'ATTENDANT']);

module.exports = {
  checkRole,
  isAdmin,
  isAttendant
};