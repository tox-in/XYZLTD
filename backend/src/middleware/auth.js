const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');
const { ApiError } = require('./errorHandler');
const { verifyToken } = require('../utils/jwt');

/**
 * Authentication middleware to protect routes
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required. Please provide a valid token.');
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new ApiError(401, 'Authentication required. Please provide a valid token.');
    }
    
    const decoded = verifyToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });
    
    if (!user) {
      throw new ApiError(401, 'User associated with this token no longer exists');
    }
    
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token. Please authenticate again.'));
    }
    
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired. Please login again.'));
    }
    
    next(error);
  }
};

module.exports = { authenticate };