const db = require("./src/adapters/mongodb");
const redis = require("./src/adapters/redis");
const scheduler = require("node-cron");
const logger = require("./src/services/logger");
const updateCookieStock = require("./src/services/cookies/update-cookie-stock");
const processGoogleTrendsForAllKeywords = require("./src/services/google-trends/process-google-trends-for-all-keywords");

(async () => {
  try {
    await redis.init();
    await db.init();
    // await updateCookieStock(false);
    // scheduler.schedule("0 */2 * * *", updateCookieStock);
    // scheduler.schedule("* * * * *", processGoogleTrendsForAllKeywords);
    // await processGoogleTrendsForAllKeywords();
    logger.info("All jobs are running");
  } catch (err) {
    logger.error(err.message);
  }
})();
