    const { Worker } = require('worker_threads');
    const path = require('path');
    const getMaliciousList = require('../utils/maliciousList');


    async function handleFileCheck(uuid, fileHashes, nextCall) {
        const maliciousList = await getMaliciousList();
        return new Promise((resolve, reject) => {
            const worker = new Worker(path.resolve(__dirname, '../workers/fileCheckWorker.js'));
            
            worker.postMessage({ uuid, fileHashes, nextCall, maliciousList });

            worker.on('message', (result) => {
            resolve(result);
            worker.terminate();
            });

            worker.on('error', (error) => {
            reject(error);
            worker.terminate();
            });

            worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
            }
            });
        });
    }

    module.exports = { handleFileCheck }; // Correct export
