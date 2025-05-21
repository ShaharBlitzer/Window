const  { determineState }  = require('../utils/endpointUtils');
const EndpointManager = require('./EndpointManager');

async function updateEndpointStates() {
  const endpoints = await EndpointManager.getAllEndpoints();
 

  // for (const endpoint of endpoints) {
  //   const newState = await determineState(endpoint.nextCall);
  //   endpoint.state = newState; // Update the state
  // }

  // Write the updated endpoints back to the file
  for (const endpoint of endpoints) {
    await EndpointManager.upsertEndpoint(endpoint.uuid, endpoint.state, endpoint.nextCall, endpoint.maliciousCount);
  }
  return endpoints;
}

module.exports = updateEndpointStates;
