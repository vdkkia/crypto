const fs = require("fs");
const { updateDailyTrend } = require("../daily-trends");
const { updateWeeklyTrend } = require("../weekly-trends");
const logger = require("../logger");

const saveSnapshotRecord = async ({
  timelineData,
  averages,
  timeSpan,
  keyword,
  compareWith,
}) => {
  try {
    if (timeSpan === "week") {
      await updateWeeklyTrend({
        keyword,
        reference: compareWith,
        timelineData,
        averages,
      });
    } else {
      await updateDailyTrend({
        keyword,
        reference: compareWith,
        timelineData,
        averages,
      });
    }
  } catch (err) {
    logger.error(err.message);
  }
};

module.exports = saveSnapshotRecord;
