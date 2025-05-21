const express = require('express');

const checkFilesRoute  = require('./routes/maliciousRoutes');
const EndpointManager = require('./services/EndpointManager');

const cors = require('cors'); 
const { logError } = require('./utils/logError');

const app = express();
const PORT = 5000;


// Initialize the JSON file
(async () => {
  await EndpointManager.ensureFile();
  console.log('EndpointManager initialized');
})();



// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Routes
app.use(
    '/api',
     checkFilesRoute
);



async function cleanUp() {
  console.log('Cleaning up before shutdown...');
  try {
    await EndpointManager.clearEndpoints();
    console.log('Cleared endpoints.json file.');
  } catch (error) {
    await logError(error);
    console.error('Failed to clear endpoints.json file:', error.message);
  }
  process.exit(0);
}

process.on('SIGINT', cleanUp);
process.on('SIGTERM', cleanUp);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
