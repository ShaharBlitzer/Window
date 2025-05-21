class Endpoint {
  constructor(uuid, nextCall, maliciousCount) {
    this.uuid = uuid; // Unique identifier
    this.state = "stable"; // Current state 
    this.nextCall = nextCall; // Next expected interaction time
    this.maliciousCount = maliciousCount; // Count of malicious files
  }

  // Optional: Update fields for existing endpoint
  update(state, nextCall, maliciousCount) {
    this.state = state;
    this.nextCall = determineNextCall(this.nextCall, nextCall);
    this.maliciousCount = maliciousCount;
  }

  toJSON() {
    return {
      uuid: this.uuid,
      state: this.state,
      nextCall: this.nextCall,
      maliciousCount: this.maliciousCount,
    };
  }

}


module.exports = Endpoint;
