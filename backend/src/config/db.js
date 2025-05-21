const { PrismaClient } = require('@prisma/client');
const { logger } = require('../middleware/logger');

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });
}

prisma.$on('error', (e) => {
  logger.error(`Prisma Error: ${e.message}`);
});

async function testConnection() {
  try {
    await prisma.$connect();
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    return false;
  }
}

async function initializeDatabase() {
  const connected = await testConnection();
  if (!connected) {
    logger.error('Unable to connect to the database. Exiting...');
    process.exit(1);
  }
}

module.exports = {
  prisma,
  testConnection,
  initializeDatabase,
};