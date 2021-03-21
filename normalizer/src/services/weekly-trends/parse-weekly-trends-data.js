const moment = require("moment");
const logger = require("./../logger");

const parseWeeklyTrendsData = (weeklyTrends) => {
  try {
    const lastDatapoint =
      weeklyTrends.timelineData[weeklyTrends.timelineData.length - 1];
    const keyword = weeklyTrends.keyword || "UNKNOWN";
    const record = {
      interest_values: [],
      ref_values: [],
      report_time: Number(lastDatapoint.time),
      time: moment.unix(Number(lastDatapoint.time)).format(),
      last_value: lastDatapoint.value[0],
      is_last_value_partial: lastDatapoint.isPartial ? true : false,
      average: weeklyTrends.reference ? weeklyTrends.averages[0] : null,
      ref_average: weeklyTrends.reference ? weeklyTrends.averages[1] : null,
      keyword,
      reference: weeklyTrends.reference || null,
    };

    const timeMap = {};

    weeklyTrends.timelineData.forEach((dp) => {
      if (!dp.isPartial) {
        record.interest_values.push(dp.value[0]);
        if (weeklyTrends.reference) {
          record.ref_values.push(dp.value[1]);
        }

        timeMap[Number(dp.time)] = {
          value: dp.value[0],
          refValue: weeklyTrends.reference ? dp.value[1] : undefined,
        };
      }
    });
    return { record, timeMap };
  } catch (err) {
    logger.error(
      `error in parsing weekly trend data for ${weeklyTrends.keyword} ref: ${
        weeklyTrends.reference || "none"
      }`
    );
    logger.error(err.message);
    throw err;
  }
};

module.exports = parseWeeklyTrendsData;
