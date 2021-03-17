const redis = require("./src/adapters/redis");
const scheduler = require("node-cron");
const logger = require("./src/services/logger");
const updateCookieStock = require("./src/services/cookies/update-cookie-stock");
const getGoogleTrendsDataForAllKeywords = require("./src/services/google-trends/get-google-trends-data-for-all-keywords");
const { createBatches } = require("./src/services/batches");

(async () => {
  try {
    await redis.init();
    await updateCookieStock(false);
    await createBatches();
    // if (process.env.NODE_ENV === "production") {
      scheduler.schedule("0 */2 * * *", updateCookieStock);
      scheduler.schedule("* * * * *", getGoogleTrendsDataForAllKeywords);
      logger.info("All jobs are running");
    // } else {
    //   logger.info("no jobs scheduled.");
    //   // await getGoogleTrendsDataForAllKeywords();
    // }
  } catch (err) {
    logger.error(err.message);
  }
})();
