const Queue = require("bull");

const logger = require("../services/logger");
const { loadCookie } = require("../services/cookies");
const getTimelineDataKey = require("../services/google-trends/get-timeline-data-key");
const fetchTimelineData = require("../services/google-trends/fetch-timeline-data");
const sendDataForNormalization = require("../services/normalization/send-data-for-normalization");

const SEVEN_DAYS = 60 * 1000 * (60 * 24 * 7 - 1);

const updateWeeklyRefForKeywordQueue = new Queue(
  "update-weekly-ref-for-keyword-queue",
  process.env.REDIS_URI
);

updateWeeklyRefForKeywordQueue.process(async (job) => {
  const {
    data: {
      index,
      keyword: { term, category },
      totalKeywords,
      ref,
    },
  } = job;
  logger.info(
    `getting weekly refs for keyword ${term} (${
      index + 1
    }/${totalKeywords}) compared with ${ref}`
  );
  const cookie = await loadCookie(index % process.env.COOKIE_STOCK_SIZE);
  if (!cookie) {
    logger.info("Waiting for cookie...");
    return false;
  }

  const timelineDataKey = await getTimelineDataKey({
    keywords: [term, ref],
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
    reference: ref,
    timelineData,
    averages,
    timeSpan: "week",
  });

  return timelineData.length;
});

updateWeeklyRefForKeywordQueue.on("completed", (job, result) => {
  if (result) {
    logger.info(
      `job ${
        job.id
      }: received ${result} data points for weekly ref updated for keyword ${
        job.data.keyword.term
      } (${job.data.index + 1}/${job.data.totalKeywords})`
    );
  }
});

updateWeeklyRefForKeywordQueue.on("failed", (job, error) => {
  logger.error(
    `job ${job.id}: unable to update weekly ref for keyword ${
      job.data.keyword.term
    } (${job.data.index + 1}/${job.data.totalKeywords})`
  );
  logger.error(error.message);
});

module.exports = updateWeeklyRefForKeywordQueue;
