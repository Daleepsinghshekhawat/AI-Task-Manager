/**
 * Configuration Validation Module
 * Validates required environment variables and app config at startup
 */

const validateConfig = () => {
  const requiredVars = ["PORT", "NODE_ENV"];
  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }

  const config = {
    port: parseInt(process.env.PORT, 10),
    nodeEnv: process.env.NODE_ENV,
    logLevel: process.env.LOG_LEVEL || "info",
    dbPath: process.env.DB_PATH || "./taskmanager.sqlite",
  };

  // Validate port is valid number
  if (config.port < 1 || config.port > 65535 || isNaN(config.port)) {
    throw new Error(
      `Invalid PORT value: ${process.env.PORT}. Must be between 1-65535.`,
    );
  }

  // Validate NODE_ENV
  const validEnvs = ["development", "production", "test"];
  if (!validEnvs.includes(config.nodeEnv)) {
    throw new Error(
      `Invalid NODE_ENV: ${config.nodeEnv}. Must be one of: ${validEnvs.join(", ")}`,
    );
  }

  return config;
};

module.exports = { validateConfig };
