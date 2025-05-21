const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Get all users with pagination
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Array} Array of users
 */
const getAllUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      skip,
      take: parseInt(limit)
    }),
    prisma.user.count()
  ]);
  
  return {
    data: users,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      hasNext: skip + users.length < total,
      hasPrev: page > 1
    }
  };
};

/**
 * Get user by ID
 * @param {String} id - User ID
 * @returns {Object} User object
 */
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  return user;
};

/**
 * Update user
 * @param {String} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Object} Updated user
 */
const updateUser = async (id, userData) => {
  const existingUser = await prisma.user.findUnique({
    where: { id }
  });
  
  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }
  
  if (userData.email && userData.email !== existingUser.email) {
    const emailInUse = await prisma.user.findUnique({
      where: { email: userData.email }
    });
    
    if (emailInUse) {
      throw new ApiError(409, 'Email is already in use');
    }
  }
  
  const updateData = { ...userData };
  
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }
  
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
  
  return updatedUser;
};

/**
 * Delete user
 * @param {String} id - User ID
 * @returns {Object} Deleted user
 */
const deleteUser = async (id) => {
  const existingUser = await prisma.user.findUnique({
    where: { id }
  });
  
  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }
  
  const deletedUser = await prisma.user.delete({
    where: { id }
  });
  
  const { password, ...userWithoutPassword } = deletedUser;
  
  return userWithoutPassword;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};