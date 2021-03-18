const redis = require("./../../adapters/redis");
const WEEKLY_TREND_FOR_KEYWORD_REDIS_PREFIX = "WEEKLY_TREND:";

const loadWeeklyTrendForKeyword = async (keyword) => {
  const str = await redis
    .client()
    .get(WEEKLY_TREND_FOR_KEYWORD_REDIS_PREFIX + keyword);
  if (str !== null) return JSON.parse(str);
  return null;
};

module.exports = loadWeeklyTrendForKeyword;
