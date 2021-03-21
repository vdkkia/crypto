const redis = require("./../../adapters/redis");
const loadReferencedWeeklyTrendForKeyword = require("./load-referenced-weekly-trend-for-keyword");
const findRefScaleFactor = require("./utils/find-ref-scale-factor");
const WEEKLY_TREND_FOR_KEYWORD_REDIS_PREFIX = "WEEKLY_TREND:";
const WEEKLY_TREND_REF_FOR_KEYWORD_REDIS_PREFIX = "WEEKLY_TREND:REF";

const ONE_WEEK = 7 * 24 * 60 * 60;

const updateWeeklyTrendCache = async (newTrendData) => {
  if (newTrendData.record.reference) {
    await redis
      .client()
      .set(
        WEEKLY_TREND_REF_FOR_KEYWORD_REDIS_PREFIX + newTrendData.record.keyword,
        JSON.stringify(newTrendData),
        "ex",
        ONE_WEEK
      );
  } else {
    const refTrend = await loadReferencedWeeklyTrendForKeyword(
      newTrendData.record.keyword
    );

    if (!refTrend) throw new Error("Reference weekly trend not available");

    const scaleFactor = findRefScaleFactor({
      trendData: newTrendData,
      refTrend,
    });

    newTrendData.record.ref_average = refTrend.record.ref_average * scaleFactor;
    newTrendData.record.average =
      newTrendData.record.interest_values.reduce((tot, v) => tot + v, 0) /
      newTrendData.record.interest_values.length;
    newTrendData.record.reference = refTrend.record.reference;
  }
  return redis
    .client()
    .set(
      WEEKLY_TREND_FOR_KEYWORD_REDIS_PREFIX + newTrendData.record.keyword,
      JSON.stringify(newTrendData),
      "ex",
      ONE_WEEK
    );
};

module.exports = updateWeeklyTrendCache;
