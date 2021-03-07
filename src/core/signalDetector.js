const sendAlertQueue = require("../queues/send-alert-queue");

const signalDetector = (data, keywords, logger) => {
  let jumps = 0;
  try {
    logger.info(typeof data);
    if (data && data.length > 1) {
      const lastData = data.pop();
      const restData = data;
      lastData.value.forEach((val, i) => {
        // Calculate average of item i in restData
        const avg =
          restData.map((x) => x.value[i]).reduce((t, j) => t + j) /
          restData.length;
        logger.warn(`Coin: ${keywords[i]} Average is ${avg}, value is: ${val}`);
        if (avg > 0 && val > avg * 5) {
          logger.warn("=======================================");
          logger.info(`Jump detected!!!, coin: ${keywords[i]}`);
          logger.warn("=======================================");
          sendAlertQueue.add({
            text: `jump detected on ${keywords[i]}`,
          });
          jumps += 1;
        }
      });
    } else {
      logger.warn("Data is incomplete.");
    }
    return jumps;
  } catch (err) {
    logger.error("Error" + err);
    return jumps;
  }
};

module.exports = signalDetector;
