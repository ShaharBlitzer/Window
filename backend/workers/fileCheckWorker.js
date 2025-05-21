const { parentPort, workerData  } = require('worker_threads');
const EndpointManager = require('../services/EndpointManager');
const { logError } = require('../utils/logError');
const { determineState } = require('../utils/endpointUtils');



parentPort.on('message', async ({ uuid, fileHashes, nextCall, maliciousList }) => {
    try {
        const maliciousFiles = fileHashes.filter((hash) => maliciousList.includes(hash));
        maliciousCount = maliciousFiles.length
        // Add endpoint to EndpointManager
        const updatedState = determineState(nextCall)
        await EndpointManager.upsertEndpoint(uuid, updatedState, nextCall, maliciousCount);
        // await saveRequest(uuid, expectedTime, state, maliciousCount)
        parentPort.postMessage({
            uuid,
            maliciousFiles,
        });
    } catch (error) {
    console.log(error.message);
    await logError(error);
    parentPort.postMessage({ error: error.message });
    }
    });
