import mongoose from 'mongoose';

import { logger } from './utils/logger';
import { getEnv } from './config/env';
import app from './app';

const NODE_ENV = getEnv('NODE_ENV', 'development');
const MONGO_URI = getEnv('MONGO_URI');
const PORT = Number(getEnv('PORT', '3000'));

if (!MONGO_URI) {
  logger.error('MONGO_URI is not defined in the environment variables.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info('MongoDB connected successfully');
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });
