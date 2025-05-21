const reportService = require('../services/reportService');
const { ApiError } = require('../middleware/errorHandler');
const { logger } = require('../middleware/logger');

/**
 * Get outgoing cars report
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const getOutgoingCarsReport = async (req, res, next) => {
  try {
    const { startDate, endDate, parkingId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!startDate || !endDate) {
      throw new ApiError(400, 'Start date and end date are required');
    }
    
    const report = await reportService.getOutgoingCarsReport(
      startDate,
      endDate,
      parkingId || null,
      page,
      limit
    );
    
    logger.info(`Outgoing cars report generated from ${startDate} to ${endDate}`);
    
    res.status(200).json({
      success: true,
      message: 'Outgoing cars report retrieved successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get entered cars report
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const getEnteredCarsReport = async (req, res, next) => {
  try {
    const { startDate, endDate, parkingId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!startDate || !endDate) {
      throw new ApiError(400, 'Start date and end date are required');
    }
    
    const report = await reportService.getEnteredCarsReport(
      startDate,
      endDate,
      parkingId || null,
      page,
      limit
    );
    
    logger.info(`Entered cars report generated from ${startDate} to ${endDate}`);
    
    res.status(200).json({
      success: true,
      message: 'Entered cars report retrieved successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get daily revenue report
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const getDailyRevenueReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      throw new ApiError(400, 'Start date and end date are required');
    }
    
    const report = await reportService.getDailyRevenueReport(startDate, endDate);
    
    logger.info(`Daily revenue report generated from ${startDate} to ${endDate}`);
    
    res.status(200).json({
      success: true,
      message: 'Daily revenue report retrieved successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get parking utilization report
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const getParkingUtilizationReport = async (req, res, next) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      throw new ApiError(400, 'Date is required');
    }
    
    const report = await reportService.getParkingUtilizationReport(date);
    
    logger.info(`Parking utilization report generated for ${date}`);
    
    res.status(200).json({
      success: true,
      message: 'Parking utilization report retrieved successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOutgoingCarsReport,
  getEnteredCarsReport,
  getDailyRevenueReport,
  getParkingUtilizationReport
};