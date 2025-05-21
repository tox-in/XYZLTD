const ticketService = require('../services/ticketService');
const { ApiError } = require('../middleware/errorHandler');
const { logger } = require('../middleware/logger');

/**
 * Generate a ticket for a car entry
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const generateTicket = async (req, res, next) => {
  try {
    const { carEntryId } = req.body;
    
    if (!carEntryId) {
      throw new ApiError(400, 'Car entry ID is required');
    }
    
    const result = await ticketService.generateTicket(carEntryId);
    
    logger.info(`Ticket generated for car entry ID ${carEntryId}`);
    
    res.status(201).json({
      success: true,
      message: 'Ticket generated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get ticket by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new ApiError(400, 'Ticket ID is required');
    }
    
    const result = await ticketService.getTicketById(id);
    
    res.status(200).json({
      success: true,
      message: 'Ticket retrieved successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get ticket by ticket number
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const getTicketByNumber = async (req, res, next) => {
  try {
    const { ticketNumber } = req.params;
    
    if (!ticketNumber) {
      throw new ApiError(400, 'Ticket number is required');
    }
    
    const result = await ticketService.getTicketByNumber(ticketNumber);
    
    res.status(200).json({
      success: true,
      message: 'Ticket retrieved successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateTicket,
  getTicketById,
  getTicketByNumber
};