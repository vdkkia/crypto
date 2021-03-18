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
      console.log(timelineData[timelineData.length - 1]);
      // console.log(JSON.stringify({ timelineData, averages }));
      // fs.writeFileSync(
      //   "./sample-weekly-data.json",
      //   JSON.stringify({ timelineData, averages })
      // );
      await updateWeeklyTrend({
        keyword,
        reference: compareWith,
        timelineData,
        averages,
      });
    } else {
      console.log(timelineData[timelineData.length - 1]);
      // console.log(JSON.stringify({ timelineData, averages }));
      // fs.writeFileSync(
      //   "./sample-daily-data.json",
      //   JSON.stringify({ timelineData, averages })
      // );
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
