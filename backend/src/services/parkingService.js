const { prisma } = require('../config/db');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Create a new parking
 * @param {Object} parkingData - Parking data
 * @returns {Object} Created parking
 */
const createParking = async (parkingData) => {
  const existingParking = await prisma.parking.findUnique({
    where: { code: parkingData.code }
  });
  
  if (existingParking) {
    throw new ApiError(409, 'Parking with this code already exists');
  }
  
  const parking = await prisma.parking.create({
    data: {
      code: parkingData.code,
      name: parkingData.name,
      totalSpaces: parkingData.totalSpaces,
      availableSpaces: parkingData.totalSpaces,
      location: parkingData.location,
      hourlyRate: parkingData.hourlyRate
    }
  });
  
  return parking;
};

/**
 * Get all parkings with pagination
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Array} Array of parkings with pagination info
 */
const getAllParkings = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const [parkings, total] = await Promise.all([
    prisma.parking.findMany({
      skip,
      take: parseInt(limit)
    }),
    prisma.parking.count()
  ]);
  
  return {
    data: parkings,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      hasNext: skip + parkings.length < total,
      hasPrev: page > 1
    }
  };
};

/**
 * Get parking by ID
 * @param {String} id - Parking ID
 * @returns {Object} Parking object
 */
const getParkingById = async (id) => {
  const parking = await prisma.parking.findUnique({
    where: { id }
  });
  
  if (!parking) {
    throw new ApiError(404, 'Parking not found');
  }
  
  return parking;
};

/**
 * Update parking
 * @param {String} id - Parking ID
 * @param {Object} parkingData - Parking data to update
 * @returns {Object} Updated parking
 */
const updateParking = async (id, parkingData) => {
  const existingParking = await prisma.parking.findUnique({
    where: { id }
  });
  
  if (!existingParking) {
    throw new ApiError(404, 'Parking not found');
  }
  
  if (parkingData.code && parkingData.code !== existingParking.code) {
    const codeInUse = await prisma.parking.findUnique({
      where: { code: parkingData.code }
    });
    
    if (codeInUse) {
      throw new ApiError(409, 'Parking code is already in use');
    }
  }
  
  // If totalSpaces is updated, adjust availableSpaces
  let updateData = { ...parkingData };
  
  if (parkingData.totalSpaces) {
    const occupiedSpaces = existingParking.totalSpaces - existingParking.availableSpaces;
    const newAvailableSpaces = Math.max(0, parkingData.totalSpaces - occupiedSpaces);
    
    updateData.availableSpaces = newAvailableSpaces;
  }
  
  const updatedParking = await prisma.parking.update({
    where: { id },
    data: updateData
  });
  
  return updatedParking;
};

/**
 * Delete parking
 * @param {String} id - Parking ID
 * @returns {Object} Deleted parking
 */
const deleteParking = async (id) => {
  const existingParking = await prisma.parking.findUnique({
    where: { id }
  });
  
  if (!existingParking) {
    throw new ApiError(404, 'Parking not found');
  }
  
  const activeEntries = await prisma.carEntry.count({
    where: {
      parkingId: id,
      exitDateTime: null
    }
  });
  
  if (activeEntries > 0) {
    throw new ApiError(400, 'Cannot delete parking with active car entries');
  }
  
  const deletedParking = await prisma.parking.delete({
    where: { id }
  });
  
  return deletedParking;
};

/**
 * Update parking space availability
 * @param {String} parkingId - Parking ID
 * @param {Number} change - Change in available spaces (positive for increase, negative for decrease)
 * @returns {Object} Updated parking
 */
const updateParkingSpaces = async (parkingId, change) => {
  const parking = await prisma.parking.findUnique({
    where: { id: parkingId }
  });
  
  if (!parking) {
    throw new ApiError(404, 'Parking not found');
  }
  
  const newAvailableSpaces = parking.availableSpaces + change;
  
  if (newAvailableSpaces < 0) {
    throw new ApiError(400, 'No available parking spaces');
  }
  
  if (newAvailableSpaces > parking.totalSpaces) {
    throw new ApiError(400, 'Available spaces cannot be more than total spaces');
  }
  
  const updatedParking = await prisma.parking.update({
    where: { id: parkingId },
    data: { availableSpaces: newAvailableSpaces }
  });
  
  return updatedParking;
};

module.exports = {
  createParking,
  getAllParkings,
  getParkingById,
  updateParking,
  deleteParking,
  updateParkingSpaces
};