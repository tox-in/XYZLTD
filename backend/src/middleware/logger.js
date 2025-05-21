const winston = require('winston');
const path = require('path');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
  // Add this to properly log error objects
  winston.format((info) => {
    if (info instanceof Error) {
      return Object.assign({}, info, {
        message: info.message,
        stack: info.stack
      });
    }
    return info;
  })()
);

// Add a dedicated validation error transport if needed
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: logFormat,
  defaultMeta: { service: 'parking-management-system' },
  transports: [
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/error.log'), 
      level: 'error',
      handleExceptions: true,
      handleRejections: true
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/combined.log'),
      handleExceptions: true,
      handleRejections: true
    }),
    // Optional: dedicated validation error log
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/validation.log'),
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      filter: (info) => info.message.includes('Validation error')
    })
  ],
});