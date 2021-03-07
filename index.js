require("dotenv").config();
const redis = require("./src/database/redis");
const scheduler = require("node-cron");
const logger = require("./src/core/build-logger");
const updateCookieStock = require("./src/services/cookies/update-cookie-stock");
const processGoogleTrendsForAllKeywords = require("./src/services/google-trends/process-google-trends-for-all-keywords");

(async () => {
  await redis.init(logger);
  const success = await updateCookieStock(logger, false);
  if (success) {
    // scheduler.schedule("0 */2 * * *", updateCookieStock.bind(logger));
    // scheduler.schedule("* * * * * *", updateCookieStock.bind(null, logger));
    // await processGoogleTrendsForAllKeywords(
    //   logger,
    //   process.env.ACTIVE_SECONDS_PER_MIN
    // );
    logger.info("All jobs are running");
  } else {
    logger.error("Failed to initialize cookie stock for the first time");
  }
})();
