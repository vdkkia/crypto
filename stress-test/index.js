const moment = require("moment");
const Bottleneck = require("bottleneck");
require("dotenv").config();

const getDataKey = require("./get-data-key");
const buildLogger = require("./build-logger");
const printFinalReport = require("./print-final-report");

const logger = buildLogger(moment().format("YYMMDD-HHmmss"));

const RUN_FOR_MINS = 1;
const DELAY_BETWEEN_CALLS_MS = 250;
const MAX_CONCURRENCY = 50;

const numberOfCalls = Math.floor(
  (RUN_FOR_MINS * 60 * 1000) / DELAY_BETWEEN_CALLS_MS
);

logger.info(`calling ${numberOfCalls} times`);

const limiter = new Bottleneck({
  minTime: DELAY_BETWEEN_CALLS_MS,
  maxConcurrent: MAX_CONCURRENCY,
});

const throttledGetDataKey = limiter.wrap(getDataKey);

(async () => {
  const jobPromises = [];

  for (let i = 0; i < numberOfCalls; i++) {
    logger.info(`added job #${i} of ${numberOfCalls}`);
    jobPromises.push(throttledGetDataKey(i + 1, numberOfCalls, logger));
  }

  try {
    const results = await Promise.all(jobPromises);
    printFinalReport(results, logger);
  } catch (err) {
    logger.error(err.message);
  }
})();
