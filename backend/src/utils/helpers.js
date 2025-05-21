/**
 * Generate a random string with specified length
 * @param {Number} length - Length of the string to generate
 * @returns {String} Random string
 */
const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

/**
 * Generate a ticket number with a prefix and random string
 * @param {String} prefix - Prefix for the ticket number
 * @returns {String} Ticket number
 */
const generateTicketNumber = (prefix = 'TCK') => {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = generateRandomString(4);
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Calculate the duration between two dates in hours
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Number} Duration in hours
 */
const calculateDurationInHours = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationMs = end - start;
  const durationHours = durationMs / (1000 * 60 * 60);
  return Math.max(0, Math.ceil(durationHours * 100) / 100); // Round up to 2 decimal places
};

/**
 * Calculate amount to charge based on duration and hourly rate
 * @param {Number} durationHours - Duration in hours
 * @param {Number} hourlyRate - Rate per hour
 * @returns {Number} Total charge
 */
const calculateCharge = (durationHours, hourlyRate) => {
  return Math.ceil(durationHours * hourlyRate * 100) / 100; // Round up to 2 decimal places
};

/**
 * Paginate an array of results
 * @param {Array} data - Array of data to paginate
 * @param {Number} page - Current page number
 * @param {Number} limit - Number of items per page
 * @returns {Object} Paginated result with metadata
 */
const paginate = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {
    data: data.slice(startIndex, endIndex),
    pagination: {
      total: data.length,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(data.length / limit),
      hasNext: endIndex < data.length,
      hasPrev: page > 1
    }
  };

  return results;
};

module.exports = {
  generateRandomString,
  generateTicketNumber,
  calculateDurationInHours,
  calculateCharge,
  paginate
};
