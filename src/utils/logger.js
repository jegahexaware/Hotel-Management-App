import { env } from 'process';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevel = (env.LOG_LEVEL || 'info').toLowerCase();

function shouldLog (level) {
  return levels[level] <= levels[currentLevel];
}

function formatMessage (level, message) {
  const timestamp = new Date().toISOString();
  return `${timestamp} [${level.toUpperCase()}] ${message}`;
}

const logger = {
  error (msg, ...args) {
    if (shouldLog('error')) {
      console.error(formatMessage('error', msg), ...args);
    }
  },
  warn (msg, ...args) {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', msg), ...args);
    }
  },
  info (msg, ...args) {
    if (shouldLog('info')) {
      console.info(formatMessage('info', msg), ...args);
    }
  },
  debug (msg, ...args) {
    if (shouldLog('debug')) {
      console.debug(formatMessage('debug', msg), ...args);
    }
  }
};

export default logger;
export { logger };