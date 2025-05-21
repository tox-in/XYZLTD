const app = require('./app');
const { logger } = require('./middleware/logger');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally: process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  // Optionally: process.exit(1);
});