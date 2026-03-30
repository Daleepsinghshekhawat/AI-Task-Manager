require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const logger = require("./config/logger");
const { validateConfig } = require("./config/validation");
const taskRoutes = require("./routes/tasks");

// Validate config at startup
let config;
try {
  config = validateConfig();
  logger.info("CONFIG", "Environment validated successfully", {
    env: config.nodeEnv,
    port: config.port,
  });
} catch (error) {
  console.error("Configuration Error:", error.message);
  process.exit(1);
}

// Ensure models are registered with Sequelize
require("./models/Task");

const app = express();
const PORT = config.port;

app.use(cors());
// Built-in JSON body parser with a size limit protecting against abusive payloads
app.use(express.json({ limit: "10kb" }));

// Primary application routes
app.use("/api/tasks", taskRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error("GLOBAL_ERROR", err.message, {
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Internal Server Error";

  res.status(statusCode).json({
    error: message,
    requestId: req.id || Date.now(),
  });
});

// Sync DB & Start server
const startServer = async () => {
  try {
    await sequelize.sync(); // Creates SQLite table if it does not exist
    logger.info("DATABASE", "Database synchronized successfully");

    app.listen(PORT, () => {
      logger.info(
        "SERVER",
        `Backend server is running on http://localhost:${PORT}`,
        { env: config.nodeEnv },
      );
    });
  } catch (error) {
    logger.error("SERVER_START", "Failed to start server", {
      error: error.message,
    });
    process.exit(1);
  }
};

// Start the server if script executing directly
if (require.main === module) {
  startServer();
}

module.exports = app; // export for testing purposes
