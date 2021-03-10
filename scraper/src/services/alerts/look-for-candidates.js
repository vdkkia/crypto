const logger = require("../logger");
const FACTOR = 50;

const lookForCandidates = ({ timelineData, keywords }) => {
  const jumps = [];
  try {
    keywords.forEach((keyword, i) => {
      let sum = 0;
      timelineData.forEach((dataPoint) => {
        sum += dataPoint.value[i];
      });
      const average = sum / timelineData.length;
      const lastValue = timelineData[timelineData.length - 1].value[i];
      if (average > 0 && lastValue > FACTOR * average) {
        logger.warn("=======================================");
        logger.warn(`Candidate detected!!!, coin: ${keyword}`);
        logger.warn(`avg: ${average}, value: ${lastValue}`);
        logger.warn("=======================================");
        jumps.push(keyword);
      }
    });
    return jumps;
  } catch (err) {
    logger.error("Error: " + err.message);
    return jumps;
  }
};

module.exports = lookForCandidates;
