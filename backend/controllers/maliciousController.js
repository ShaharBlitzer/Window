const maliciousList = require('../utils/maliciousList');

const checkFiles = (req, res) => {
  const { uuid, fileHashes } = req.body;
  const maliciousFiles = fileHashes.filter(hash => maliciousList.includes(hash));
  const response = {
    uuid,
    maliciousFiles,
    receivedAt: new Date(),
  };
  res.status(200).json(response);
};

module.exports = { checkFiles };
