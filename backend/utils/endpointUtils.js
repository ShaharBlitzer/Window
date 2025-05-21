const { logError } = require('./logError');

require('dotenv').config();

function determineState (nextCall)  {
    const currentTime = Date.now();
    const expiredTime = Number(process.env.EXPIRED_TIME);

  
    if (isNaN(expiredTime)) {
      // throw new Error("Invalid EXPIRED_TIME environment variable");
      logError("Invalid EXPIRED_TIME environment variable")

    }
    const nextCallDate = new Date(nextCall);
    const currentTimeDate = new Date(currentTime);
    const expirationThreshold = nextCallDate.getTime() + expiredTime;

    if (currentTimeDate <= nextCallDate) return "stable";
    if (currentTimeDate > expirationThreshold) return "inactive";
    return "unstable";
  };

  function isItTheLatestRequest(existingNextCall, newNextCall) {
    const existingDate = new Date(existingNextCall);
    const newDate = new Date(newNextCall);
    return newDate > existingDate;
  }
  
module.exports = {determineState, isItTheLatestRequest};
  