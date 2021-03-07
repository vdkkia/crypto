const sendAlertQueue = require("../../queues/send-alert-queue");
const saveJumpsQueue = require("../../queues/save-jumps-queue");

const lookForJumps = ({ timelineData, keywords, categoryMap, logger }) => {
  const jumps = [];
  try {
    keywords.forEach((keyword, i) => {
      const keywordTimelineData = [];
      let sum = 0;
      timelineData.forEach((dataPoint) => {
        keywordTimelineData.push({
          time: Number(dataPoint.time),
          formattedTime: dataPoint.formattedTime,
          formattedAxisTime: dataPoint.formattedAxisTime,
          value: dataPoint.value[i],
          hasData: dataPoint.hasData[i],
          formattedValue: dataPoint.formattedValue[i],
        });
        sum += dataPoint.value[i];
      });
      const average = sum / timelineData.length;
      const lastValue = timelineData[timelineData.length - 1].value[i];
      if (average > 0 && lastValue > 200 * average) {
        logger.warn("=======================================");
        logger.warn(`Jump detected!!!, coin: ${keyword}`);
        logger.warn(`avg: ${average}, value: ${lastValue}`);
        logger.warn("=======================================");
        const jumpData = {
          keyword,
          category: categoryMap[keyword],
          trend: keywordTimelineData,
          reportTimestamp: Number(timelineData[timelineData.length - 1].time),
        };
        jumps.push(jumpData);
        saveJumpsQueue.add(jumpData);
        sendAlertQueue.add({
          text: `jump detected on ${keyword}- category: ${categoryMap[keyword]}`,
        });
      }
    });
  } catch (err) {
    logger.error("Error: " + err.message);
  } finally {
    return jumps;
  }
};

module.exports = lookForJumps;
