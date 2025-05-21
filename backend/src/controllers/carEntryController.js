const carEntryService = require('../services/carEntryService');
const { ApiError } = require('../middleware/errorHandler');
const { logger } = require('../middleware/logger');

/**
 * Register car entry
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const registerCarEntry = async (req, res, next) => {
  try {
    const { plateNumber, parkingId } = req.body;
    
    if (!plateNumber || !parkingId) {
      throw new ApiError(400, 'Plate number and parking ID are required');
    }
    
    const attendantId = req.user.id;
    
    const result = await carEntryService.registerCarEntry({ plateNumber, parkingId }, attendantId);
    
    logger.info(`Car with plate ${plateNumber} registered for entry by attendant ${attendantId}`);
    
    res.status(201).json({
      success: true,
      message: 'Car entry registered successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register car exit
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const registerCarExit = async (req, res, next) => {
  try {
    const { carEntryId } = req.params;
    
    if (!carEntryId) {
      throw new ApiError(400, 'Car entry ID is required');
    }
    
    const result = await carEntryService.registerCarExit(carEntryId);
    
    logger.info(`Car with entry ID ${carEntryId} registered for exit`);
    
    res.status(200).json({
      success: true,
      message: 'Car exit registered successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all car entries
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const getAllCarEntries = async (req, res, next) => {
  try {
    const { page, limit, plateNumber, parkingId, status } = req.query;
    
    const filters = {};
    
    if (plateNumber) {
      filters.plateNumber = plateNumber;
    }
    
    if (parkingId) {
      filters.parkingId = parkingId;
    }
    
    if (status && ['active', 'completed'].includes(status)) {
      filters.status = status;
    }
    
    const result = await carEntryService.getAllCarEntries(
      parseInt(page) || 1,
      parseInt(limit) || 10,
      filters
    );
    
    res.status(200).json({
      success: true,
      message: 'Car entries retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get car entry by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const getCarEntryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new ApiError(400, 'Car entry ID is required');
    }
    
    const result = await carEntryService.getCarEntryById(id);
    
    res.status(200).json({
      success: true,
      message: 'Car entry retrieved successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate bill for car entry
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const generateBill = async (req, res, next) => {
  try {
    const { carEntryId } = req.params;
    
    if (!carEntryId) {
      throw new ApiError(400, 'Car entry ID is required');
    }
    
    const result = await carEntryService.generateBill(carEntryId);
    
    res.status(200).json({
      success: true,
      message: 'Bill generated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerCarEntry,
  registerCarExit,
  getAllCarEntries,
  getCarEntryById,
  generateBill
};