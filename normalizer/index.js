const restify = require("restify");
const routes = require("./src/routes");
const redis = require("./src/adapters/redis");
const mongodb = require("./src/adapters/mongodb");
const logger = require("./src/services/logger");
const sampleDailyData = require("./src/data/sample-past-day-data.json");
const sampleWeeklyData = require("./src/data/sample-seven-days-data.json");
const buildHourlyChartFromDaily = require("./src/services/normalizaton/utils/build-hourly-chart-from-daily");
const parseWeeklyTrendsData = require("./src/services/weekly-trends/parse-weekly-trends-data");

const server = restify.createServer({ name: "data normalizer server" });
routes(server);

(async () => {
  try {
    await redis.init();
    await mongodb.init();
    // const hourlyValues = buildHourlyChartFromDaily(sampleDailyData);
    // const weeklyTrends = parseWeeklyTrendsData(sampleWeeklyData);

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
