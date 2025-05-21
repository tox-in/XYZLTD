const parkingService = require('../services/parkingService');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Create a new parking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createParking = async (req, res, next) => {
  try {
    const parking = await parkingService.createParking(req.body);
    res.status(201).json({
      success: true,
      message: 'Parking created successfully',
      data: parking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all parkings with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getAllParkings = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const parkings = await parkingService.getAllParkings(page, limit);
    res.status(200).json({
      success: true,
      message: 'Parkings retrieved successfully',
      ...parkings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get parking by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getParkingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const parking = await parkingService.getParkingById(id);
    res.status(200).json({
      success: true,
      message: 'Parking retrieved successfully',
      data: parking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update parking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateParking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedParking = await parkingService.updateParking(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Parking updated successfully',
      data: updatedParking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete parking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteParking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedParking = await parkingService.deleteParking(id);
    res.status(200).json({
      success: true,
      message: 'Parking deleted successfully',
      data: deletedParking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createParking,
  getAllParkings,
  getParkingById,
  updateParking,
  deleteParking
};