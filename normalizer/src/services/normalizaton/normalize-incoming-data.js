const { updateDailyTrend } = require("../daily-trends");
const logger = require("../logger");
const { updateWeeklyTrend } = require("../weekly-trends");

const normalizeIncomingData = async ({
  keyword,
  reference,
  timelineData,
  averages,
  timeSpan,
}) => {
  try {
    if (timeSpan === "week") {
      await updateWeeklyTrend({ keyword, reference, timelineData, averages });
    } else {
      await updateDailyTrend({ keyword, timelineData });
    }
  } catch (err) {
    logger.error(err.message);
  }
};

module.exports = normalizeIncomingData;
