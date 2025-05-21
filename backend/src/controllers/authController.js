const authService = require('../services/authService');

/**
 * Controller for user registration
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user, token }
    });
  } catch (error) {
    next(error); // Pass errors to the error handling middleware
  }
};


/**
 * Controller for user login
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body.email, req.body.password);
    
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};