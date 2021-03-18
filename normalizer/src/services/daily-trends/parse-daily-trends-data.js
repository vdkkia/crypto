const moment = require("moment");

const parseDailyTrendsData = ({
  timelineData,
  averages,
  keyword = "UNKNOWN",
  reference = "UNKNOWN",
  scaleFactor,
  weeklyTrend,
}) => {
  const lastDatapoint = timelineData[timelineData.length - 1];
  const lastFixedDatapoint = lastDatapoint.isPartial
    ? timelineData[timelineData.length - 2]
    : lastDatapoint;
  const lastThreeDays = weeklyTrend.record.interest_values.slice(-73, -1);
  const threeDayAverage =
    lastThreeDays.reduce((a, b) => a + b, 0) / lastThreeDays.length;
  const jumpFactor =
    (lastFixedDatapoint.value[0] * 7.5 * scaleFactor) / threeDayAverage;
  const record = {
    interest_values: [],
    ref_values: [],
    report_time: Number(lastDatapoint.time),
    time: moment.unix(Number(lastDatapoint.time)).format(),
    last_value: lastDatapoint.value[0],
    is_last_value_partial: lastDatapoint.isPartial ? true : false,
    last_fixed_value: lastFixedDatapoint.value[0],
    average: averages[0],
    ref_average: averages[1],
    keyword,
    reference,
    scale_factor: scaleFactor,
    jump_factor: jumpFactor,
    three_day_average: threeDayAverage,
  };

  timelineData.forEach((dp) => {
    if (!dp.isPartial) {
      record.interest_values.push(dp.value[0]);
      record.ref_values.push(dp.value[1]);
    }
  });

  return record;
};

module.exports = parseDailyTrendsData;
