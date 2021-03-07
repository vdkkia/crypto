const Bottleneck = require("bottleneck");
const getDataKey = require("./get-data-key");
const printFinalReport = require("./print-final-report");
const loadCookieStock = require("./load-cookie-stock");
const coinGroups = require("../database/coins");
const logger = require("./build-logger");
const DELAY_BETWEEN_CALLS_MS = process.env.DELAY_BETWEEN_CALLS_MS;
const MAX_CONCURRENCY = process.env.MAX_CONCURRENCY;
const numberOfCalls = coinGroups.length * 1;
const { default: PQueue } = require("p-queue");
const queue = new PQueue({ concurrency: 1 });

const limiter = new Bottleneck({
  minTime: DELAY_BETWEEN_CALLS_MS,
  maxConcurrent: MAX_CONCURRENCY,
});

const throttledGetDataKey = limiter.wrap(getDataKey);
const jobPromises = [];

const run = async () => {
  await queue.add(async () => {
    logger.info("Queue: a task was added to the Q.");
    return await scrape();
  });
};

const scrape = async () => {
  try {
    jobPromises.length = 0;
    logger.info(`calling ${numberOfCalls} times`);
    const cookieStock = await loadCookieStock();
    logger.info(`loaded cookie info for ${cookieStock.length} proxies`);
    let i = 0;
    coinGroups.forEach((coinGroup) => {
      i++;
      let cookieSet = cookieStock[i % cookieStock.length];
      addJob(cookieSet.proxyUri, cookieSet.cookie, coinGroup, i);
      // for (const coin of coinGroup) {
      //   i++;
      //   cookieSet = cookieStock[i % cookieStock.length];
      //   addJob(cookieSet.proxyUri, cookieSet.cookie, coin, i);
      // }
    });

    const results = await Promise.all(jobPromises);
    printFinalReport(results, logger);
  } catch (err) {
    logger.error(err.message);
  }
};

const addJob = (proxyUri, cookie, keywords, jobNumber) => {
  logger.info(`added job #${jobNumber} of ${numberOfCalls}`);
  jobPromises.push(
    throttledGetDataKey({
      jobNumber,
      totalJobs: numberOfCalls,
      logger,
      proxyUri,
      cookie,
      keywords,
    })
  );
};

module.exports = { run };
