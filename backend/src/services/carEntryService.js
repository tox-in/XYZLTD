const { prisma } = require('../config/db');
const { ApiError } = require('../middleware/errorHandler');
const { calculateDurationInHours, calculateCharge } = require('../utils/helpers');
const parkingService = require('./parkingService');
const ticketService = require('./ticketService');

/**
 * Register car entry
 * @param {Object} entryData - Car entry data
 * @param {String} attendantId - ID of the attendant registering the entry
 * @returns {Object} Car entry with ticket
 */
const registerCarEntry = async (entryData, attendantId) => {
  const parking = await prisma.parking.findUnique({
    where: { id: entryData.parkingId }
  });
  
  if (!parking) {
    throw new ApiError(404, 'Parking not found');
  }
  

  if (parking.availableSpaces <= 0) {
    throw new ApiError(400, 'No available parking spaces');
  }
  
  //transaction
  const result = await prisma.$transaction(async (prisma) => {
    const carEntry = await prisma.carEntry.create({
      data: {
        plateNumber: entryData.plateNumber,
        parkingId: entryData.parkingId,
        attendantId: attendantId
      }
    });
    
    // Update available parking spaces
    await prisma.parking.update({
      where: { id: entryData.parkingId },
      data: { availableSpaces: { decrement: 1 } }
    });
    
    // Generate ticket
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber: `TCK-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
        carEntryId: carEntry.id
      }
    });
    
    return { carEntry, ticket };
  });
  
  return result;
};

/**
 * Register car exit
 * @param {String} carEntryId - Car entry ID
 * @returns {Object} Updated car entry with charge details
 */
const registerCarExit = async (carEntryId) => {
  const carEntry = await prisma.carEntry.findUnique({
    where: { id: carEntryId },
    include: { parking: true }
  });
  
  if (!carEntry) {
    throw new ApiError(404, 'Car entry not found');
  }
  
  if (carEntry.exitDateTime) {
    throw new ApiError(400, 'Car has already exited');
  }
  
  const exitDateTime = new Date();
  const durationHours = calculateDurationInHours(carEntry.entryDateTime, exitDateTime);
  const chargedAmount = calculateCharge(durationHours, carEntry.parking.hourlyRate);
  
  //transaction to ensure data consistency
  const result = await prisma.$transaction(async (prisma) => {
    const updatedCarEntry = await prisma.carEntry.update({
      where: { id: carEntryId },
      data: {
        exitDateTime,
        chargedAmount
      },
      include: {
        ticket: true,
        parking: true
      }
    });
    
    await prisma.parking.update({
      where: { id: carEntry.parkingId },
      data: { availableSpaces: { increment: 1 } }
    });
    
    return updatedCarEntry;
  });
  
  return {
    ...result,
    durationHours
  };
};

/**
 * Get all car entries with pagination
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @param {Object} filters - Optional filters
 * @returns {Array} Array of car entries with pagination info
 */
const getAllCarEntries = async (page = 1, limit = 10, filters = {}) => {
  const skip = (page - 1) * limit;
  
  // Build filter conditions
  const where = {};
  
  if (filters.plateNumber) {
    where.plateNumber = { contains: filters.plateNumber, mode: 'insensitive' };
  }
  
  if (filters.parkingId) {
    where.parkingId = filters.parkingId;
  }
  
  if (filters.status === 'active') {
    where.exitDateTime = null;
  } else if (filters.status === 'completed') {
    where.exitDateTime = { not: null };
  }
  
  const [carEntries, total] = await Promise.all([
    prisma.carEntry.findMany({
      where,
      include: {
        parking: true,
        ticket: true,
        attendant: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      skip,
      take: parseInt(limit),
      orderBy: { entryDateTime: 'desc' }
    }),
    prisma.carEntry.count({ where })
  ]);
  
  return {
    data: carEntries,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      hasNext: skip + carEntries.length < total,
      hasPrev: page > 1
    }
  };
};

/**
 * Get car entry by ID
 * @param {String} id - Car entry ID
 * @returns {Object} Car entry object
 */
const getCarEntryById = async (id) => {
  const carEntry = await prisma.carEntry.findUnique({
    where: { id },
    include: {
      parking: true,
      ticket: true,
      attendant: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });
  
  if (!carEntry) {
    throw new ApiError(404, 'Car entry not found');
  }
  
  return carEntry;
};

/**
 * Generate bill for a car entry
 * @param {String} carEntryId - Car entry ID
 * @returns {Object} Bill information
 */
const generateBill = async (carEntryId) => {
  const carEntry = await prisma.carEntry.findUnique({
    where: { id: carEntryId },
    include: {
      parking: true,
      ticket: true
    }
  });
  
  if (!carEntry) {
    throw new ApiError(404, 'Car entry not found');
  }
  
  if (!carEntry.exitDateTime) {
    throw new ApiError(400, 'Car has not exited yet');
  }
  
  const durationHours = calculateDurationInHours(carEntry.entryDateTime, carEntry.exitDateTime);
  
  return {
    id: carEntry.id,
    plateNumber: carEntry.plateNumber,
    ticketNumber: carEntry.ticket.ticketNumber,
    parkingName: carEntry.parking.name,
    parkingLocation: carEntry.parking.location,
    entryDateTime: carEntry.entryDateTime,
    exitDateTime: carEntry.exitDateTime,
    durationHours,
    hourlyRate: carEntry.parking.hourlyRate,
    chargedAmount: carEntry.chargedAmount,
    billDate: new Date()
  };
};

module.exports = {
  registerCarEntry,
  registerCarExit,
  getAllCarEntries,
  getCarEntryById,
  generateBill
};