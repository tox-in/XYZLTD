const { asyncHandler } = require('../middleware/asyncHandler');
const authService = require('../services/authService');

/**
 * Controller for user registration
 * @route POST /api/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user, token }
  });
});

/**
 * Controller for user login
 * @route POST /api/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body.email, req.body.password);
  
  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: { user, token }
  });
});

module.exports = {
  register,
  login
};