const restify = require("restify");
const routes = require("./src/routes");
const redis = require("./src/adapters/redis");
const mongodb = require("./src/adapters/mongodb");
const logger = require("./src/services/logger");
const checkForFastJump = require("./src/services/alerts/check-for-fast-jump");
const normalizeIncomingData = require("./src/services/normalizaton/normalize-incoming-data");
const comparedSample = require("./sample-data/sample-compared-data-weekly.json");
const weeklySample = require("./sample-data/sample-weekly-data.json");
const dailySample = require("./sample-data/sample-daily-data.json");
const loadReferencedWeeklyTrendForKeyword = require("./src/services/weekly-trends/load-referenced-weekly-trend-for-keyword");
const findRelativeScale = require("./src/services/daily-trends/find-relative-scale");

const sample = dailySample;

const server = restify.createServer({ name: "data normalizer server" });
routes(server);

(async () => {
  try {
    await redis.init();
    await mongodb.init();

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
