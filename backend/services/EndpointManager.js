const fs = require('fs').promises;
const path = require('path');
const {isItTheLatestRequest, determineState} = require("../utils/endpointUtils");
const { logError } = require('../utils/logError');

class EndpointManager {
  constructor() {
    this.filePath = path.resolve(__dirname, '../data/endpoints.json');
    this.locked = false;
  }

  // Ensures the JSON file exists
  async ensureFile() {
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, JSON.stringify([]));
    }
  }

  // Acquire a lock (simple lock to prevent concurrent writes)
  async acquireLock() {
    while (this.locked) {
      await new Promise((resolve) => setTimeout(resolve, 10)); // Wait for 10ms before retrying
    }
    this.locked = true;
  }

  // Release the lock
  releaseLock() {
    this.locked = false;
  }

  // Read all endpoints from the JSON file
  async getAllEndpoints() {
    await this.ensureFile();
    const data = await fs.readFile(this.filePath, 'utf8');
    try {
      return JSON.parse(data);

    } catch (error) {
      console.error('Error parsing endpoints JSON:', error);
      await logError(error);
      return [];
    }
  }
  //  delay(ms) { // to be deleted
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }
  // Add or update an endpoint
  async upsertEndpoint(uuid, state, nextCall, maliciousCount) {
    await this.ensureFile();
    await this.acquireLock();

    try {
      const endpoints = await this.getAllEndpoints();
      const existingIndex = endpoints.findIndex((ep) => ep.uuid === uuid);

      if (existingIndex !== -1) {
        // Update existing endpoint
        endpoints[existingIndex] = this.updateEndpoint(endpoints[existingIndex], {
          state,
          nextCall,
          maliciousCount,
        });
      } else {
        
        // Add new endpoint
        endpoints.push({ uuid, state, nextCall, maliciousCount });
      }

      // Write back to the JSON file
      await fs.writeFile(this.filePath, JSON.stringify(endpoints, null, 2));
    } finally {
      this.releaseLock();
    }
  }


  // Update an existing endpoint with new fields
  updateEndpoint(existingEndpoint, updatedFields) {
    const { nextCall: newNextCall, state: newState, maliciousCount: newMaliciousCount, ...otherFields } = updatedFields;
    const isLatest =  isItTheLatestRequest(existingEndpoint.nextCall,newNextCall)
    
    

    if (isLatest) {
      // Update all fields including nextCall and maliciousCount
      return {
        ...existingEndpoint,
        ...otherFields,
        nextCall: newNextCall,
        state:  determineState(newNextCall),
        maliciousCount: newMaliciousCount,
      };
    } else {
      // Do NOT update nextCall or other fields except update state by determineState
      const updatedState =  determineState(existingEndpoint.nextCall);

      return {
        ...existingEndpoint,
        state: updatedState,
      };
    }
  }

  async clearEndpoints() {
    await this.acquireLock();
    try {
      await fs.writeFile(this.filePath, JSON.stringify([], null, 2));
    } finally {
      this.releaseLock();
    }
  }

}





module.exports = new EndpointManager();
