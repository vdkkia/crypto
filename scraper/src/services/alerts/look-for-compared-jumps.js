const sendAlertQueue = require("../../queues/send-alert-queue");
const saveJumpsQueue = require("../../queues/save-jumps-queue");
const logger = require("../logger");
const FACTORS = ["0.02", "0.05", "0.1"];

const lookForComparedJumps = ({ timelineData, keywords, categoryMap }) => {
  const jumps = [];
  let litecoinAvg;
  try {
    logger.warn("Comparing keywords... " + keywords.join(" | "));
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

      if (i === 0) {
        litecoinAvg = sum / timelineData.length;
      } else {
        const lastValue = timelineData[timelineData.length - 1].value[i];
        FACTORS.forEach((factor) => {
          if (litecoinAvg > 0 && lastValue > factor * litecoinAvg) {
            logger.warn("=======================================");
            logger.warn(`Jump detected!!!, coin: ${keyword}`);
            logger.warn(`litecoin Avg: ${litecoinAvg}, value: ${lastValue}, factor: ${factor}`);
            logger.warn("=======================================");
            const jumpData = {
              keyword,
              category: categoryMap[keyword],
              trend: keywordTimelineData,
              reportTimestamp: Number(timelineData[timelineData.length - 1].time),
            };
            jumps.push(jumpData);
            saveJumpsQueue.add(jumpData);
            const alertMessage = `jump detected on <https://trends.google.com/trends/explore?date=now%204-H&q=${encodeURIComponent(
              keyword
            )}|${keyword}> - category: ${categoryMap[keyword]}`;
            sendAlertQueue.add({
              text: alertMessage,
              blocks: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: alertMessage,
                  },
                },
              ],
            });
          }
        });
      }
    });
    return jumps;
  } catch (err) {
    logger.error("Error: " + err.message);
    return jumps;
  }
};

module.exports = lookForComparedJumps;
