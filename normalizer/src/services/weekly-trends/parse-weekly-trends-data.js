const parseWeeklyTrendsData = (weeklyTrends) => {
  const lastDatapoint =
    weeklyTrends.timelineData[weeklyTrends.timelineData.length - 1];
  const trendsData = {
    values: [],
    refValues: [],
    lastPointTime: Number(lastDatapoint.time),
    lastValue: lastDatapoint.value[0],
    isLastValuePartial: lastDatapoint.isPartial ? true : false,
    average: weeklyTrends.averages[0],
    refAverage: weeklyTrends.averages[1],
  };

  const timeMap = {};

  weeklyTrends.timelineData.forEach((dp) => {
    if (!dp.isPartial) {
      trendsData.values.push(dp.value[0]);
      trendsData.refValues.push(dp.value[1]);
      timeMap[Number(dp.time)] = {
        value: dp.value[0],
        refValue: dp.value[1],
      };
    }
  });
  return { trendsData, timeMap };
};

module.exports = parseWeeklyTrendsData;
