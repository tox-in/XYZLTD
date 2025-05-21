const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const { generateToken } = require('../utils/jwt');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Register a new user
 * @param {Object} userData - User data for registration
 * @returns {Object} Registered user and token
 */
const register = async (userData) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email }
  });
  
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  const user = await prisma.user.create({
    data: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'USER'
    }
  });
  
  const token = generateToken({ userId: user.id });
  
  // Return user data (excluding password) and token
  const { password, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    token
  };
};

/**
 * Login a user
 * @param {String} email - User email
 * @param {String} password - User password
 * @returns {Object} User and token
 */
const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }
  
  const token = generateToken({ userId: user.id });
  
  // Return user data (excluding password) and token
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    token
  };
};

module.exports = {
  register,
  login
};