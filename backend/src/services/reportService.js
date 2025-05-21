const { prisma } = require('../config/db');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Get outgoing cars report
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {String} parkingId - Optional parking ID filter
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Object} Report with statistics and data
 */
const getOutgoingCarsReport = async (startDate, endDate, parkingId = null, page = 1, limit = 10) => {
  if (new Date(startDate) > new Date(endDate)) {
    throw new ApiError(400, 'Start date must be before end date');
  }
  
  const skip = (page - 1) * limit;
  
  // Filter conditions
  const where = {
    exitDateTime: {
      gte: new Date(startDate),
      lte: new Date(endDate)
    },
    exitDateTime: { not: null }
  };
  
  if (parkingId) {
    where.parkingId = parkingId;
  }
  
  // Outgoing cars with pagination
  const [outgoingCars, total] = await Promise.all([
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
      orderBy: { exitDateTime: 'desc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.carEntry.count({ where })
  ]);
  
  // Statistics
  const totalCharged = outgoingCars.reduce((sum, car) => sum + car.chargedAmount, 0);
  const averageCharge = outgoingCars.length > 0 ? totalCharged / outgoingCars.length : 0;
  
  // Group by parking
  const parkingStats = {};
  outgoingCars.forEach(car => {
    const parkingId = car.parkingId;
    if (!parkingStats[parkingId]) {
      parkingStats[parkingId] = {
        parkingName: car.parking.name,
        count: 0,
        totalCharged: 0
      };
    }
    parkingStats[parkingId].count += 1;
    parkingStats[parkingId].totalCharged += car.chargedAmount;
  });
  
  return {
    totalCars: total,
    totalCharged,
    averageCharge,
    parkingStats: Object.values(parkingStats),
    data: outgoingCars,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      hasNext: skip + outgoingCars.length < total,
      hasPrev: page > 1
    }
  };
};

/**
 * Get entered cars report
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {String} parkingId - Optional parking ID filter
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Object} Report with statistics and data
 */
const getEnteredCarsReport = async (startDate, endDate, parkingId = null, page = 1, limit = 10) => {
  if (new Date(startDate) > new Date(endDate)) {
    throw new ApiError(400, 'Start date must be before end date');
  }
  
  const skip = (page - 1) * limit;
  
  // Filter conditions
  const where = {
    entryDateTime: {
      gte: new Date(startDate),
      lte: new Date(endDate)
    }
  };
  
  if (parkingId) {
    where.parkingId = parkingId;
  }
  
  // Entered cars with pagination
  const [enteredCars, total] = await Promise.all([
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
      orderBy: { entryDateTime: 'desc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.carEntry.count({ where })
  ]);
  
  // Group by parking
  const parkingStats = {};
  const activeCount = enteredCars.filter(car => !car.exitDateTime).length;
  const completedCount = enteredCars.filter(car => car.exitDateTime).length;
  
  enteredCars.forEach(car => {
    const parkingId = car.parkingId;
    if (!parkingStats[parkingId]) {
      parkingStats[parkingId] = {
        parkingName: car.parking.name,
        count: 0,
        active: 0,
        completed: 0
      };
    }
    parkingStats[parkingId].count += 1;
    
    if (car.exitDateTime) {
      parkingStats[parkingId].completed += 1;
    } else {
      parkingStats[parkingId].active += 1;
    }
  });
  
  return {
    totalCars: total,
    activeCount,
    completedCount,
    parkingStats: Object.values(parkingStats),
    data: enteredCars,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      hasNext: skip + enteredCars.length < total,
      hasPrev: page > 1
    }
  };
};

/**
 * Get daily revenue report
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Object} Daily revenue report
 */
const getDailyRevenueReport = async (startDate, endDate) => {
  if (new Date(startDate) > new Date(endDate)) {
    throw new ApiError(400, 'Start date must be before end date');
  }
  
  const outgoingCars = await prisma.carEntry.findMany({
    where: {
      exitDateTime: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      },
      exitDateTime: { not: null }
    },
    select: {
      exitDateTime: true,
      chargedAmount: true
    }
  });
  
  // Group by day
  const dailyRevenue = {};
  
  outgoingCars.forEach(car => {
    const date = car.exitDateTime.toISOString().split('T')[0];
    
    if (!dailyRevenue[date]) {
      dailyRevenue[date] = {
        date,
        count: 0,
        revenue: 0
      };
    }
    
    dailyRevenue[date].count += 1;
    dailyRevenue[date].revenue += car.chargedAmount;
  });
  
  const result = Object.values(dailyRevenue).sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return {
    totalRevenue: result.reduce((sum, day) => sum + day.revenue, 0),
    totalCars: result.reduce((sum, day) => sum + day.count, 0),
    dailyData: result
  };
};

/**
 * Get parking utilization report
 * @param {Date} date - Date to get report for
 * @returns {Object} Parking utilization report
 */
const getParkingUtilizationReport = async (date) => {
  const reportDate = new Date(date);
  const startOfDay = new Date(reportDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(reportDate.setHours(23, 59, 59, 999));
  
  const parkings = await prisma.parking.findMany();
  
  const entries = await prisma.carEntry.findMany({
    where: {
      OR: [
        {
          // Entered on the report date
          entryDateTime: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        {
          // entered before, exited on/after report date or still parked)
          entryDateTime: { lt: startOfDay },
          OR: [
            { exitDateTime: { gte: startOfDay } },
            { exitDateTime: null }
          ]
        }
      ]
    }
  });
  
  // Calculate utilization for each parking
  const utilizationData = parkings.map(parking => {
    const parkingEntries = entries.filter(entry => entry.parkingId === parking.id);
    const utilization = (parkingEntries.length / parking.totalSpaces) * 100;
    
    return {
      parkingId: parking.id,
      parkingName: parking.name,
      totalSpaces: parking.totalSpaces,
      utilisedSpaces: parkingEntries.length,
      utilizationPercentage: Math.round(utilization * 100) / 100,
      currentAvailableSpaces: parking.availableSpaces
    };
  });
  
  return {
    date: startOfDay.toISOString().split('T')[0],
    totalParkings: parkings.length,
    averageUtilization: utilizationData.reduce((sum, item) => sum + item.utilizationPercentage, 0) / utilizationData.length,
    parkingData: utilizationData
  };
};

module.exports = {
  getOutgoingCarsReport,
  getEnteredCarsReport,
  getDailyRevenueReport,
  getParkingUtilizationReport
};