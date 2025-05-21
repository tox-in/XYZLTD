const { prisma } = require('../config/db');
const { ApiError } = require('../middleware/errorHandler');
const { generateTicketNumber } = require('../utils/helpers');

/**
 * Generate a ticket for a car entry
 * @param {String} carEntryId - Car entry ID
 * @returns {Object} Generated ticket
 */
const generateTicket = async (carEntryId) => {
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
  
  // Check if ticket already exists
  if (carEntry.ticket) {
    throw new ApiError(400, 'Ticket already exists for this entry');
  }
  
  const ticketNumber = generateTicketNumber();
  
  // Create ticket
  const ticket = await prisma.ticket.create({
    data: {
      ticketNumber,
      carEntryId
    },
    include: {
      carEntry: {
        include: {
          parking: true
        }
      }
    }
  });
  
  return {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    plateNumber: ticket.carEntry.plateNumber,
    parkingName: ticket.carEntry.parking.name,
    parkingLocation: ticket.carEntry.parking.location,
    entryDateTime: ticket.carEntry.entryDateTime,
    issuedAt: ticket.issuedAt
  };
};

/**
 * Get ticket by ID
 * @param {String} id - Ticket ID
 * @returns {Object} Ticket object
 */
const getTicketById = async (id) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      carEntry: {
        include: {
          parking: true
        }
      }
    }
  });
  
  if (!ticket) {
    throw new ApiError(404, 'Ticket not found');
  }
  
  return ticket;
};

/**
 * Get ticket by ticket number
 * @param {String} ticketNumber - Ticket number
 * @returns {Object} Ticket object
 */
const getTicketByNumber = async (ticketNumber) => {
  const ticket = await prisma.ticket.findUnique({
    where: { ticketNumber },
    include: {
      carEntry: {
        include: {
          parking: true
        }
      }
    }
  });
  
  if (!ticket) {
    throw new ApiError(404, 'Ticket not found');
  }
  
  return ticket;
};

module.exports = {
  generateTicket,
  getTicketById,
  getTicketByNumber
};