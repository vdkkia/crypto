const axios = require("axios");
const Bottleneck = require("bottleneck");
const getTimelineDataKey = require("./get-timeline-data-key");
const fetchTimelineData = require("./fetch-timeline-data");
const loadCookies = require("../cookies/load-cookies");
const keywords = require("./../../database/keywords.json");
const prepareBatches = require("./utils/prepare-batches");
const printFinalReport = require("../../core/print-final-report");

const cleanKeywords = keywords.map(({ term, category }) => ({
  term: term.trim(),
  category,
}));

const FOUR_HOUR = 60 * 60 * 1000 * 4;

const categoryMap = cleanKeywords.reduce(
  (acc, kw) => ({
    ...acc,
    [kw.term]: kw.category,
  }),
  {}
);
const batches = prepareBatches(cleanKeywords, 5);

const processGoogleTrendsForAllKeywords = async (
  logger,
  secondsToComplete = 50
) => {
  try {
    const startTime = Date.now();
    logger.info(
      `processing google trends for ${cleanKeywords.length} keywords in ${batches.length} batches`
    );
    const reqsPerSec = batches.length / secondsToComplete;
    logger.info(`sending ${reqsPerSec} requests per seconds`);
    const msBetweenReqs = Math.ceil(
      (secondsToComplete * 1000) / batches.length
    );
    logger.info(`time between requests: ${msBetweenReqs} ms`);
    const cookies = await loadCookies();
    logger.info(`loaded ${cookies.length} cookies`);
    const batchPromises = [];
    const limiter = new Bottleneck({
      minTime: msBetweenReqs,
      maxConcurrent: process.env.MAX_CONCURRENCY,
    });

    const throttledGetTrendDataForBatch = limiter.wrap(getTrendDataForBatch);

    for (let i = 0; i < batches.length; i++) {
      batchPromises.push(
        throttledGetTrendDataForBatch({
          batchNumber: i + 1,
          totalBatches: batches.length,
          logger,
          cookie: cookies[i % cookies.length],
          keywords: batches[i].map(({ term }) => term),
        })
      );
    }

    const results = await Promise.all(batchPromises);
    const endTime = Date.now();
    logger.info(
      `The whole process took ${(endTime - startTime) / 1000} seconds to finish`
    );
    printFinalReport(results, logger);
  } catch (err) {
    logger.error(err.message);
  }
};

module.exports = processGoogleTrendsForAllKeywords;

async function getTrendDataForBatch({
  batchNumber,
  totalBatches,
  logger,
  proxyUri = process.env.PROXY_URI,
  cookie,
  keywords,
}) {
  try {
    logger.info(
      `getting data for batch ${batchNumber}/${totalBatches}: ${keywords.join(
        " | "
      )}`
    );
    const timelineDataKey = await getTimelineDataKey({
      keywords,
      startTime: new Date(Date.now() - FOUR_HOUR),
      granularTimeResolution: true,
      proxyUri,
      cookie,
    });
    logger.info(`received key for batch ${batchNumber}/${totalBatches}`);
    const timelineData = await fetchTimelineData(timelineDataKey);
    logger.info(
      `received timeline data for batch ${batchNumber}/${totalBatches}`
    );
    return 1;
  } catch (err) {
    if (axios.isCancel(err)) {
      logger.error(`batch ${batchNumber} canceled`);
      logger.error(err.message);
      return 0;
    } else {
      logger.error(
        `job ${batchNumber} failed with status ${err?.response?.status} and code ${err.code}.`
      );
      logger.error(err.message);
      return -1;
    }
  }
}
