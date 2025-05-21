const app = require('./app');
const { logger } = require('./middleware/logger');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});