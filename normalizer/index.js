const restify = require("restify");
const routes = require("./src/routes");
const redis = require("./src/adapters/redis");
const mongodb = require("./src/adapters/mongodb");
const logger = require("./src/services/logger");
const sampleDailyData = require("./src/data/sample-daily-data.json");
const sampleWeeklyData = require("./src/data/sample-weekly-data.json");
const parseWeeklyTrendsData = require("./src/services/weekly-trends/parse-weekly-trends-data");
const { loadWeeklyTrendForKeyword } = require("./src/services/weekly-trends");
const { updateDailyTrend } = require("./src/services/daily-trends");

const server = restify.createServer({ name: "data normalizer server" });
routes(server);

(async () => {
  try {
    await redis.init();
    await mongodb.init();
    // const hourlyValues = buildHourlyChartFromDaily(sampleDailyData);
    // const weeklyTrends = parseWeeklyTrendsData(sampleWeeklyData);
    // const weeklyTrend = await loadWeeklyTrendForKeyword("bepro coin");
    // console.log(JSON.stringify(weeklyTrend));
    // await updateDailyTrend({
    //   keyword: "bepro coin",
    //   reference: "arweave",
    //   ...sampleDailyData,
    // });

    server.listen(3000, (err) => {
      if (err) {
        logger.error(
          `error happened when trying to run server ${server.name}:`
        );
        logger.error(err.message);
      }
      logger.info(`${server.name} listening at ${server.url}`);
    });
  } catch (err) {
    logger.error("error happened");
    logger.error(err.message);
  }
})();
