const checkForFastJump = require("../alerts/check-for-fast-jump");
const { loadWeeklyTrendForKeyword } = require("../weekly-trends");
const findScaleFactor = require("./find-scale-factor");
const parseDailyTrendsData = require("./parse-daily-trends-data");
const saveDailyTrendRecord = require("./save-daily-trend-record");
const logger = require("./../logger");

const updateDailyTrend = async ({ keyword, timelineData }) => {
  const weeklyTrend = await loadWeeklyTrendForKeyword(keyword);
  if (!weeklyTrend) {
    throw new Error(`no weekly trend for ${keyword}`);
  }
  const scaleFactor = findScaleFactor(weeklyTrend, timelineData);
  const parsedDailyTrend = parseDailyTrendsData({
    timelineData,
    keyword,
    scaleFactor,
    weeklyTrend,
  });
  saveDailyTrendRecord(parsedDailyTrend);
  checkForFastJump(parsedDailyTrend);
};

module.exports = updateDailyTrend;
