const redis = require("./src/adapters/redis");
const scheduler = require("node-cron");
const logger = require("./src/services/logger");
const updateCookieStock = require("./src/services/cookies/update-cookie-stock");
const { createBatches } = require("./src/services/batches");
const {
  getComparedTrendsDataForAllKeywords,
  getGoogleTrendsDataForAllKeywords,
  getGoogleTrendsDataOneByOne,
} = require("./src/services/google-trends");

(async () => {
  try {
    await redis.init();
    await updateCookieStock(false);
    await createBatches();
    if (process.env.NODE_ENV === "production") {
      scheduler.schedule("0 * * * *", updateCookieStock);
      await getGoogleTrendsDataOneByOne("day", 5);
      // await getGoogleTrendsDataForAllKeywords();
      // await getComparedTrendsDataForAllKeywords('day', 1)
      // scheduler.schedule("* * * * *", getCompa);
      // scheduler.schedule(
      //   "*/5 * * * *",
      //   getComparedTrendsDataForAllKeywords.bind(null, "day", 4)
      // );
      // scheduler.schedule(
      //   "0 * * * *",
      //   getComparedTrendsDataForAllKeywords.bind(null, "week", 40)
      // );
      logger.info("All jobs are running");
    } else {
      logger.info("no jobs scheduled.");
      await getGoogleTrendsDataOneByOne({
        timeSpan: "week",
        minsToComplete: 5,
        compareWith: "arweave",
      });
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
