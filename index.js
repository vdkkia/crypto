require("dotenv").config();
const logger = require("./src/core/build-logger");
const redis = require("./src/database/redis");
const jobRunner = require("./src/core/jobRunner");

(async () => {
  await redis.init(logger);
  // await redis.reset();
  // jobRunner.start(logger);
  jobRunner.manualRun(logger);
})();
