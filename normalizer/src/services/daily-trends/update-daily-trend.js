const checkForFastJump = require("../alerts/check-for-fast-jump");
const { loadWeeklyTrendForKeyword } = require("../weekly-trends");
const findScaleFactor = require("./find-scale-factor");
const parseDailyTrendsData = require("./parse-daily-trends-data");
const saveDailyTrendRecord = require("./save-daily-trend-record");
const loadReferencedWeeklyTrendForKeyword = require("../weekly-trends/load-referenced-weekly-trend-for-keyword");
const findRelativeScale = require("./find-relative-scale");
const logger = require("./../logger");

const updateDailyTrend = async ({ keyword, timelineData }) => {
  logger.info(`updating daily trend for ${keyword}`);
  const weeklyTrend = await loadWeeklyTrendForKeyword(keyword);
  const refTrend = await loadReferencedWeeklyTrendForKeyword(keyword);
  if (!weeklyTrend) {
    throw new Error(`no weekly trend for ${keyword}`);
  }
  if (!refTrend) {
    throw new Error(`no ref trend for ${keyword} yet`);
  }
  if (timelineData.length === 0) {
    throw new Error(`daily trend data for ${keyword} is empty`);
  }
  const scaleFactor = findScaleFactor(weeklyTrend, timelineData);
  const relativeScale = findRelativeScale(refTrend);
  const parsedDailyTrend = parseDailyTrendsData({
    timelineData,
    keyword,
    scaleFactor,
    weeklyTrend,
  });
  saveDailyTrendRecord(parsedDailyTrend);
  checkForFastJump(parsedDailyTrend, relativeScale, weeklyTrend, refTrend);
};

module.exports = updateDailyTrend;
