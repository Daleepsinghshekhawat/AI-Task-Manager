/**
 * Structured Logger Module
 * Provides consistent logging with timestamps and context
 */

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const getLogLevel = () => {
  const envLevel = process.env.LOG_LEVEL || "info";
  return LOG_LEVELS[envLevel] || LOG_LEVELS.info;
};

const formatTimestamp = () => {
  return new Date().toISOString();
};

const formatLog = (level, context, message, data = null) => {
  const timestamp = formatTimestamp();
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    context,
    message,
  };

  if (data) {
    logEntry.data = data;
  }

  return JSON.stringify(logEntry);
};

const logger = {
  error: (context, message, data) => {
    if (LOG_LEVELS.error <= getLogLevel()) {
      console.error(formatLog("error", context, message, data));
    }
  },
  warn: (context, message, data) => {
    if (LOG_LEVELS.warn <= getLogLevel()) {
      console.warn(formatLog("warn", context, message, data));
    }
  },
  info: (context, message, data) => {
    if (LOG_LEVELS.info <= getLogLevel()) {
      console.log(formatLog("info", context, message, data));
    }
  },
  debug: (context, message, data) => {
    if (LOG_LEVELS.debug <= getLogLevel()) {
      console.log(formatLog("debug", context, message, data));
    }
  },
};

module.exports = logger;
