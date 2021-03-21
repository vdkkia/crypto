const redis = require("./src/adapters/redis");
const logger = require("./src/services/logger");
const jobs = require("./src/jobs");

(async () => {
  try {
    await redis.init();
    await jobs.run();
  } catch (err) {
    logger.error(err.message);
  }
})();
