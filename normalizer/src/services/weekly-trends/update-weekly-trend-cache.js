const redis = require("./../../adapters/redis");
const WEEKLY_TREND_FOR_KEYWORD_REDIS_PREFIX = "WEEKLY_TREND:";

const ONE_WEEK = 7 * 24 * 60 * 60;

const updateWeeklyTrendCache = async (newTrendData) =>
  redis
    .client()
    .set(
      WEEKLY_TREND_FOR_KEYWORD_REDIS_PREFIX + newTrendData.record.keyword,
      JSON.stringify(newTrendData),
      "ex",
      ONE_WEEK
    );

module.exports = updateWeeklyTrendCache;
