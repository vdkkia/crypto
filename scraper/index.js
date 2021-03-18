const redis = require("./src/adapters/redis");
const scheduler = require("node-cron");
const logger = require("./src/services/logger");
const updateCookieStock = require("./src/services/cookies/update-cookie-stock");
const { createBatches } = require("./src/services/batches");
const {
  getComparedTrendsDataForAllKeywords,
  getGoogleTrendsDataForAllKeywords,
} = require("./src/services/google-trends");
const sampleDailyData = require("./data/sample-past-day-data.json");
const dampleWeeklyData = require("./data/sample-seven-days-data.json");
const sendDataForNormalization = require("./src/services/normalization/send-data-for-normalization");

(async () => {
  try {
    await redis.init();
    await updateCookieStock(false);
    await createBatches();
    if (process.env.NODE_ENV === "production") {
      scheduler.schedule("*/30 * * * *", updateCookieStock);
      scheduler.schedule("* * * * *", getGoogleTrendsDataForAllKeywords);
      // scheduler.schedule(
      //   "*/10 * * * *",
      //   getComparedTrendsDataForAllKeywords.bind(null, "day", 8)
      // );
      // scheduler.schedule(
      //   "0 * * * *",
      //   getComparedTrendsDataForAllKeywords.bind(null, "week", 10)
      // );
      logger.info("All jobs are running");
    } else {
      logger.info("no jobs scheduled.");
      // await getComparedTrendsDataForKeyword("bepro coin");
      // await getGoogleTrendsDataForAllKeywords();
      // await getComparedTrendsDataForAllKeywords("day", 1);
      // await getComparedTrendsDataForAllKeywords("day", 1);
      // await sendDataForNormalization({
      //   keyword: "thekey",
      //   compareWith: "arweave",
      //   timeSpan: "day",
      //   ...sampleDailyData,
      // });
    }
  } catch (err) {
    logger.error(err.message);
  }
})();
