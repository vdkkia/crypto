const redis = require("./src/adapters/redis");
const mongodb = require("./src/adapters/mongodb");
const logger = require("./src/services/logger");
const jobs = require("./src/jobs");

(async () => {
  try {
    await redis.init();
    await mongodb.init();
    await jobs.run();
  } catch (err) {
    logger.error(err.message);
  }
})();
