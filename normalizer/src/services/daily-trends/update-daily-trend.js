const checkForFastJump = require("../alerts/check-for-fast-jump");
const { loadWeeklyTrendForKeyword } = require("../weekly-trends");
const findScaleFactor = require("./find-scale-factor");
const parseDailyTrendsData = require("./parse-daily-trends-data");
const saveDailyTrendRecord = require("./save-daily-trend-record");

const updateDailyTrend = async ({
  keyword,
  reference,
  timelineData,
  averages,
}) => {
  const weeklyTrend = await loadWeeklyTrendForKeyword(keyword);
  const scaleFactor = findScaleFactor(weeklyTrend, timelineData);
  const parsedDailyTrend = parseDailyTrendsData({
    timelineData,
    averages,
    keyword,
    reference,
    scaleFactor,
    weeklyTrend,
  });
  saveDailyTrendRecord(parsedDailyTrend);
  checkForFastJump(parsedDailyTrend);
};

module.exports = updateDailyTrend;
