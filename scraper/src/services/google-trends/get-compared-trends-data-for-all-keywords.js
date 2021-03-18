const axios = require("axios");
const Bottleneck = require("bottleneck");
const logger = require("./../logger");
const keywords = require("./../../../data/keywords.json").map(
  ({ term, category }) => ({
    term: term.trim(),
    category,
  })
);
const loadCookies = require("../cookies/load-cookies");
const getComparedTrendsDataForKeyword = require("./get-compared-trends-data-for-keyword");
const printFinalReport = require("./utils/print-final-report");
const sendDataForNormalization = require("../normalization/send-data-for-normalization");

const getComparedTrendsDataForAllKeywords = async (
  timeSpan = "day",
  minsToComplete = 6
) => {
  try {
    const startTime = Date.now();
    const reqsPerSec = keywords.length / (minsToComplete * 60);
    logger.info(`sending ${reqsPerSec} requests per seconds`);
    const msBetweenReqs = Math.ceil(
      (minsToComplete * 60 * 1000) / keywords.length
    );
    logger.info(`time between requests: ${msBetweenReqs} ms`);
    const cookies = await loadCookies();
    logger.info(`loaded ${cookies.length} cookies`);

    const batchPromises = [];
    const limiter = new Bottleneck({
      minTime: msBetweenReqs,
      maxConcurrent: process.env.MAX_CONCURRENCY,
    });

    const throttledGetComperedTrendsForKeyword = limiter.wrap(
      getComperedTrendsForKeyword
    );

    for (let i = 0; i < keywords.length; i++) {
      batchPromises.push(
        throttledGetComperedTrendsForKeyword({
          jobNumber: i + 1,
          totalJobs: keywords.length,
          cookie: cookies[i % cookies.length],
          keyword: keywords[i].term,
          timeSpan,
        })
      );
    }
    const results = await Promise.all(batchPromises);

    const endTime = Date.now();

    logger.info(
      `The whole process took ${(endTime - startTime) / 1000} seconds to finish`
    );
    printFinalReport(results, `${timeSpan} trends`);
  } catch (err) {
    logger.error(err.message);
  }
};

module.exports = getComparedTrendsDataForAllKeywords;

async function getComperedTrendsForKeyword({
  jobNumber,
  totalJobs,
  cookie,
  timeSpan,
  keyword,
  compareWith = "arweave",
}) {
  try {
    const { timelineData, averages } = await getComparedTrendsDataForKeyword({
      keyword,
      timeSpan,
      cookie,
      compareWith,
    });
    await sendDataForNormalization({
      keyword,
      compareWith,
      timelineData,
      averages,
      timeSpan,
    });
    // logger.info(
    //   `received timeline data for job ${jobNumber}/${totalJobs}: ${keyword} - ${timeSpan}`
    // );
    return 1;
  } catch (err) {
    if (axios.isCancel(err)) {
      logger.error(`batch ${jobNumber} canceled`);
      logger.error(err.message);
      return 0;
    } else {
      logger.error(
        `job ${jobNumber} failed with status ${err?.response?.status} and code ${err?.code}.`
      );
      logger.error(err.message);
      return -1;
    }
  }
}
