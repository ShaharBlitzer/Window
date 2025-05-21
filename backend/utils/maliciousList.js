const fs = require('fs').promises;
const path = require('path');
const { logError } = require('./logError');

// Path to the JSON file storing the malicious list
const filePath = path.resolve(__dirname, '../data/maliciousList.json');

async function getMaliciousList() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading malicious list:', err);
    await logError(err);
    return [];
  }
}

async function updateMaliciousList(newHashes) {
  try {
    const currentList = await getMaliciousList();
    const updatedList = Array.from(new Set([...currentList, ...newHashes])); // merge & dedupe
    await fs.writeFile(filePath, JSON.stringify(updatedList, null, 2), 'utf8');
    return updatedList;
  } catch (err) {
    console.error('Error updating malicious list:', err);
    await logError(err);
    // throw err;
  }
}

module.exports = getMaliciousList;
