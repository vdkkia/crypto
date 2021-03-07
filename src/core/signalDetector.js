const sendAlertQueue = require("../queues/send-alert-queue");

const signalDetector = async (data, keywords, logger) => {
  let mostRecent;
  try {
    if (data && data.length > 0) {
      mostRecent = Number(data.slice(-1)[0].value[0]);
      logger.info(`mostRecent is ${mostRecent}`);
      const values = data.filter((x) => x.value).map((x) => x.value[0]);
      if (values.length > 0) {
        const avg = values.reduce((t, i) => t + i) / values.length;
        logger.warn(`Average is ${avg}`);
        logger.warn(`mostRecent is ${mostRecent}`);
        if (avg > 0 && mostRecent >= 3 * avg) {
          logger.info("=================");
          logger.info("Jump detected!!!");
          logger.info("=================");
          sendAlertQueue.add({
            text: `jump detected on one of these keywords :${keywords.join(
              " | "
            )}`,
          });
        }
      }
    } else {
      logger.warn("Data is incomplete.");
    }
  } catch (err) {
    logger.error("Error" + err);
  }
};

module.exports = signalDetector;
