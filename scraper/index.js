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
const jobs = require("./src/jobs");
const schedulerOptions = { timezone: "Etc/UTC" };

(async () => {
  try {
    await redis.init();
    await jobs.run();

    // if (process.env.NODE_ENV === "production") {

    //   scheduler.schedule(
    //     "15 * * * *",
    //     getGoogleTrendsDataOneByOne.bind(null, {
    //       timeSpan: "week",
    //       minsToComplete: 55,
    //     }),
    //     schedulerOptions
    //   );

    //   scheduler.schedule(
    //     "*/8 * * * *",
    //     getGoogleTrendsDataOneByOne.bind(null, {
    //       timeSpan: "day",
    //       minsToComplete: 6,
    //     }),
    //     schedulerOptions
    //   );
    //   logger.info("All jobs are running");
    // } else {
    //   logger.info("no jobs scheduled.");
    //   // await getGoogleTrendsDataOneByOne({
    //   //   timeSpan: "week",
    //   //   minsToComplete: 5,
    //   //   compareWith: "arweave",
    //   // });
    //   // await getComparedTrendsDataForKeyword("bepro coin");
    //   // await getGoogleTrendsDataForAllKeywords();
    //   // await getComparedTrendsDataForAllKeywords("day", 1);
    //   // await getComparedTrendsDataForAllKeywords("day", 1);
    //   // await sendDataForNormalization({
    //   //   keyword: "thekey",
    //   //   compareWith: "arweave",
    //   //   timeSpan: "day",
    //   //   ...sampleDailyData,
    //   // });
    // }
  } catch (err) {
    logger.error(err.message);
  }
})();
