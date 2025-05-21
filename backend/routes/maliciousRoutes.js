    const express = require('express');
    const { handleFileCheck } = require('../services/workerService');
    const updateEndpointStates = require('../services/refreshEndpoints');
    const { logError } = require('../utils/logError');
    const router = express.Router();

    // POST endpoint for file checks
    router.post('/check-files', async (req, res) => {
        console.log(`Request received at /check-files, body: ${JSON.stringify(req.body)}`); // Add this log
        const { uuid, fileHashes, nextCall } = req.body;

        if (!uuid || !Array.isArray(fileHashes)) {
            return res.status(400).send({ error: 'Invalid request payload' });
        }
    try {
        const result = await handleFileCheck(uuid, fileHashes, nextCall);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error:', error);
        await logError(error);
        // res.status(500).send({ error: 'Internal Server Error' });
    }
    });


    router.get('/show-endpoints', async (req, res) => {
        try{
            const result = await updateEndpointStates()
            res.status(200).send(result);
            
        }catch (error) {
                console.error('Error:', error);
                await logError(error);
                // res.status(500).send({ error: 'Internal Server Error' });
            }
    })

    module.exports = router;
