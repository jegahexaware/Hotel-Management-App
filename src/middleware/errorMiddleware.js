import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error details
  logger.error(`${req.method} ${req.originalUrl} - ${statusCode} - ${message}`);

  // In development, include stack trace for debugging
  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({ message, stack: err.stack });
  }

  // In production, do not expose stack trace
  return res.status(statusCode).json({ message });
};

export default errorHandler;
