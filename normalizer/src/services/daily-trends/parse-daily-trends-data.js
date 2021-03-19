const moment = require("moment");

const parseDailyTrendsData = ({
  timelineData,
  keyword = "UNKNOWN",
  scaleFactor,
  weeklyTrend,
}) => {
  const lastDatapoint = timelineData[timelineData.length - 1];
  const lastFixedDatapoint = lastDatapoint.isPartial
    ? timelineData[timelineData.length - 2]
    : lastDatapoint;
  const lastThreeDays = weeklyTrend.record.interest_values.slice(-73, -1);
  const threeDayAverage =
    lastThreeDays.reduce((a, b) => a + b, 0) /
    (lastThreeDays.length * scaleFactor * 7.5);
  const jumpFactor = lastFixedDatapoint.value[0] / threeDayAverage;
  const record = {
    interest_values: [],
    ref_values: [],
    report_time: Number(lastDatapoint.time),
    time: moment.unix(Number(lastDatapoint.time)).format(),
    last_value: lastDatapoint.value[0],
    is_last_value_partial: lastDatapoint.isPartial ? true : false,
    last_fixed_value: lastFixedDatapoint.value[0],
    keyword,
    reference: weeklyTrend.record.reference,
    scale_factor: scaleFactor,
    jump_factor: jumpFactor,
    three_day_average: threeDayAverage,
  };

  timelineData.forEach((dp) => {
    if (!dp.isPartial) {
      record.interest_values.push(dp.value[0]);
    }
  });

  record.average =
    record.interest_values.reduce((tot, v) => tot + v, 0) /
    record.interest_values.length;
  record.ref_average = weeklyTrend.record.ref_average / (scaleFactor * 7.5);

  return record;
};

module.exports = parseDailyTrendsData;
