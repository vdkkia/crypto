require("dotenv").config();
const redis = require("./src/database/redis");
const scheduler = require("node-cron");
const logger = require("./src/core/build-logger");
const updateCookieStock = require("./src/services/cookies/update-cookie-stock");
const processGoogleTrendsForAllKeywords = require("./src/services/google-trends/process-google-trends-for-all-keywords");
const sendAlertQueue = require("./src/queues/send-alert-queue");

(async () => {
  await redis.init(logger);
  const success = await updateCookieStock(logger, false);
  if (success) {
    scheduler.schedule("0 */2 * * *", updateCookieStock.bind(null, logger));
    scheduler.schedule(
      "* * * * *",
      processGoogleTrendsForAllKeywords.bind(null, logger)
    );
    logger.info("All jobs are running");
  } else {
    logger.error("Failed to initialize cookie stock for the first time");
  }
})();
