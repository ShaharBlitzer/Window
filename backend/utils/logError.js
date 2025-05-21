const fs = require('fs').promises;
const path = require('path');

const logFilePath = path.resolve(__dirname, '../logger/errors.log');

// Log information to a log file
async function logError(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  try {
    // Ensure the logs directory exists
    await fs.mkdir(path.dirname(logFilePath), { recursive: true });
    // Append the log entry to the log file
    await fs.appendFile(logFilePath, logEntry);
  } catch (error) {
    console.error("Failed to write to log file:", error);
    await logError(error);
  }
}

module.exports = { logError };
