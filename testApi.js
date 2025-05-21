const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Define malicious hashes
const maliciousList = [
  "maliciousHash1",
  "maliciousHash2",
  "maliciousHash3"
];

// Helper to generate random file hashes
function generateFileHashes() {
  const possibleHashes = [...maliciousList, "safeHash1", "safeHash2", "safeHash3"];
  const numHashes = Math.floor(Math.random() * 5) + 1; // 1-5 hashes
  return Array.from({ length: numHashes }, () => 
    possibleHashes[Math.floor(Math.random() * possibleHashes.length)]
  );
}

// Test function
async function testApi() {
  const url = 'http://localhost:5000/api/check-files';
  
  // Generate test data
  const testData = [
    {
      uuid: uuidv4(),
      fileHashes: generateFileHashes(),
      nextCall: Date.now() + 10000 // 10 seconds in the future
    },
    {
      uuid: uuidv4(),
      fileHashes: generateFileHashes(),
      nextCall: Date.now() - 5000 // 5 seconds in the past
    },
    {
      uuid: uuidv4(),
      fileHashes: maliciousList,
      nextCall: Date.now() + 30000 // 30 seconds in the future
    },
    {
      uuid: uuidv4(),
      fileHashes: generateFileHashes(),
      nextCall: Date.now() - 10000 // 10 seconds in the past
    },
    {
      uuid: uuidv4(),
      fileHashes: ["safeHash1", "safeHash2"],
      nextCall: Date.now() // Current time
    },
  ];

  // Send each request
  for (const data of testData) {
    try {
      const response = await axios.post(url, data);
      console.log(`Request with UUID ${data.uuid} succeeded:`, response.data);
    } catch (error) {
      console.error(`Request with UUID ${data.uuid} failed:`, error.response?.data || error.message);
    }
  }
}

// Run the test
testApi();
