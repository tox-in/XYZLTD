const { asyncHandler } = require('../middleware/asyncHandler');
const userService = require('../services/userService');

/**
 * Get all users with pagination
 * @route GET /api/users
 * @access Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await userService.getAllUsers(parseInt(page), parseInt(limit));
  
  res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    ...result
  });
});

/**
 * Get user by ID
 * @route GET /api/users/:id
 * @access Private/Admin or Self
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  
  res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    data: user
  });
});

/**
 * Update user
 * @route PUT /api/users/:id
 * @access Private/Admin or Self
 */
const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUser(req.params.id, req.body);
  
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser
  });
});

/**
 * Delete user
 * @route DELETE /api/users/:id
 * @access Private/Admin or Self
 */
const deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await userService.deleteUser(req.params.id);
  
  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser
  });
});

/**
 * Get current user profile
 * @route GET /api/users/profile
 * @access Private
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.userId);
  
  res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: user
  });
});

/**
 * Update current user profile
 * @route PUT /api/users/profile
 * @access Private
 */
const updateCurrentUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUser(req.user.userId, req.body);
  
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
  updateCurrentUser
};