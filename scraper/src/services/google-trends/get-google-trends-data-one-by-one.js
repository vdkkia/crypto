const axios = require("axios");
const Bottleneck = require("bottleneck");
const logger = require("./../logger");
const getTimelineDataKey = require("./get-timeline-data-key");
const fetchTimelineData = require("./fetch-timeline-data");
const loadCookies = require("../cookies/load-cookies");
const printFinalReport = require("./utils/print-final-report");
const sendDataForNormalization = require("../normalization/send-data-for-normalization");
const keywords = require("./../../../data/keywords.json").map(
  ({ term, category }) => ({
    term: term.trim(),
    category,
  })
);
// const keywords = require("./../../../data/keywords.json").map(
//   ({ term, category }) => ({
//     term: term.trim(),
//     category,
//   })
// ).slice(0, 250);


const ONE_DAY = 60 * 60 * 1000 * 24;
const SEVEN_DAYS = 60 * 1000 * (60 * 24 * 7 - 1);

const getGoogleTrendsDataOneByOne = async (timeSpan = 'week', minsToComplete = 6) => {
  try {
    const startTime = Date.now();
    const reqsPerSec = keywords.length / (minsToComplete * 60);
    const msBetweenReqs = Math.ceil(
      (minsToComplete * 60 * 1000) / keywords.length
    );
    const cookies = await loadCookies();
    const batchPromises = [];
    const limiter = new Bottleneck({
      minTime: msBetweenReqs,
      maxConcurrent: process.env.MAX_CONCURRENCY,
    });
    const throttledJobs = limiter.wrap(getGoogleTrendsDataForOneKeyword);
    for (let i = 0; i < keywords.length; i++) {
      batchPromises.push(
        throttledJobs({
          jobNumber: i + 1,
          totalJobs: keywords.length,
          cookie: cookies[i % cookies.length],
          timeSpan,
          keyword: keywords[i].term,
          compareWith: 'arweave',
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

module.exports = getGoogleTrendsDataOneByOne;

async function getGoogleTrendsDataForOneKeyword({ 
  keyword,
  proxyUri = process.env.PROXY_URI, 
  jobNumber, 
  totalJobs, 
  cookie, 
  compareWith,
  timeSpan,
}) {
  try {
    const timelineDataKey = await getTimelineDataKey({
      // keywords: [keyword, compareWith],
      keywords: [keyword],
      startTime: new Date(Date.now() - (timeSpan === 'day' ? ONE_DAY : SEVEN_DAYS)),
      granularTimeResolution: false,
      proxyUri,
      cookie,
    });
    const timelineDataStr = await fetchTimelineData(timelineDataKey, true);
    const {
      default: { timelineData, averages },
    } = JSON.parse(timelineDataStr);
    // await sendDataForNormalization({
    //   keyword,
    //   compareWith,
    //   timelineData,
    //   averages,
    //   timeSpan,
    // });
    logger.info(
      `received timeline data for job ${jobNumber}/${totalJobs}: ${keyword} - ${timeSpan}`
    );
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