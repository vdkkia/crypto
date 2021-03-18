const logger = require("../logger");
const { updateWeeklyTrend } = require("../weekly-trends");

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
      console.log("received daily trend");
    }
  } catch (err) {
    logger.error(err.message);
  }
};

module.exports = saveSnapshotRecord;
