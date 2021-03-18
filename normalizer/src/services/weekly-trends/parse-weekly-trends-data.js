const moment = require("moment");

const parseWeeklyTrendsData = (weeklyTrends) => {
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
    average: weeklyTrends.averages[0],
    ref_average: weeklyTrends.averages[1],
    keyword,
    reference: weeklyTrends.reference || "UNKNOWN",
  };

  const timeMap = {};

  weeklyTrends.timelineData.forEach((dp) => {
    if (!dp.isPartial) {
      record.interest_values.push(dp.value[0]);
      record.ref_values.push(dp.value[1]);
      timeMap[Number(dp.time)] = {
        value: dp.value[0],
        refValue: dp.value[1],
      };
    }
  });
  return { record, timeMap };
};

module.exports = parseWeeklyTrendsData;
