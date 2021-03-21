const Queue = require("bull");

const logger = require("../services/logger");
const { loadCookie } = require("../services/cookies");
const {
  getTimelineDataKey,
  fetchTimelineData,
} = require("../services/google-trends");

const sendDataForNormalization = require("../services/normalization/send-data-for-normalization");

const SEVEN_DAYS = 60 * 1000 * (60 * 24 * 7 - 1);

const updateWeeklyTrendForKeywordQueue = new Queue(
  "update-weekly-trend-for-keyword-queue",
  process.env.REDIS_URI
);

updateWeeklyTrendForKeywordQueue.process(async (job) => {
  const {
    data: {
      index,
      keyword: { term, category },
      totalKeywords,
    },
  } = job;
  const cookie = await loadCookie(index);
  if (!cookie) {
    logger.info("Waiting for cookie...");
    return false;
  }

  const timelineDataKey = await getTimelineDataKey({
    keywords: [term],
    startTime: new Date(Date.now() - SEVEN_DAYS),
    granularTimeResolution: true,
    proxyUri: process.env.PROXY_URI,
    cookie,
  });
  const timelineDataStr = await fetchTimelineData(timelineDataKey, true);
  const {
    default: { timelineData, averages },
  } = JSON.parse(timelineDataStr);
  sendDataForNormalization({
    keyword: term,
    timelineData,
    averages,
    timeSpan: "week",
  });

  return timelineData.length;
});

updateWeeklyTrendForKeywordQueue.on("completed", (job, result) => {
  if (result) {
    logger.info(
      `[job ${job.id}]: received ${result} data points for keyword ${
        job.data.keyword.term
      } (${job.data.index + 1}/${job.data.totalKeywords})`
    );
  }
});

updateWeeklyTrendForKeywordQueue.on("failed", (job, error) => {
  logger.error(
    `[job ${job.id}]: unable to update weekly trend for keyword ${
      job.data.keyword.term
    } (${job.data.index + 1}/${job.data.totalKeywords})`
  );
  logger.error(error.message);
});

module.exports = updateWeeklyTrendForKeywordQueue;
