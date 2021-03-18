const logger = require("../logger");
const parseWeeklyTrendsData = require("./parse-weekly-trends-data");
const saveWeeklyTrendRecord = require("./save-weekly-trend-record");
const updateWeeklyTrendCache = require("./update-weekly-trend-cache");

const updateWeeklyTrend = async ({
  keyword,
  reference,
  timelineData,
  averages,
}) => {
  logger.info(`updating weekly trend for ${keyword} - ref: ${reference}`);
  const parsedWeeklyTrendsData = parseWeeklyTrendsData({
    timelineData,
    averages,
    keyword,
    reference,
  });

  saveWeeklyTrendRecord(parsedWeeklyTrendsData.record);
  await updateWeeklyTrendCache(parsedWeeklyTrendsData);
};

module.exports = updateWeeklyTrend;
