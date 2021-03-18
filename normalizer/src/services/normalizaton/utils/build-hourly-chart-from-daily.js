const buildHourlyChartFromDaily = (dailyChartData) => {
  const dataPoints = dailyChartData.timelineData;
  const hourlyValues = dataPoints.reduce((acc, dp) => {
    const hourlyTimestamp = Math.floor(Number(dp.time) / 3600) * 3600;
    if (hourlyTimestamp in acc) {
      const prevCount = acc[hourlyTimestamp].count;
      const prevValue = acc[hourlyTimestamp].value;
      const prevRefValue = acc[hourlyTimestamp].refValue;
      if (prevCount === 7) {
        return {
          ...acc,
          [hourlyTimestamp]: {
            ...acc[hourlyTimestamp],
            count: prevCount + 0.5,
            value: prevValue + dp.value[0] / 2.0,
            refValue: prevRefValue + dp.value[1] / 2.0,
          },
          [hourlyTimestamp + 3600]: {
            ...acc[hourlyTimestamp],
            count: 0.5,
            value: dp.value[0] / 2.0,
            refValue: dp.value[1] / 2.0,
          },
        };
      } else {
        return {
          ...acc,
          [hourlyTimestamp]: {
            ...acc[hourlyTimestamp],
            count: prevCount + 1,
            value: prevValue + dp.value[0],
            refValue: prevRefValue + dp.value[1],
          },
        };
      }
    } else {
      return {
        ...acc,
        [hourlyTimestamp]: {
          count: 1,
          value: dp.value[0],
          refValue: dp.value[1],
        },
      };
    }
  }, {});
  return hourlyValues;
};

module.exports = buildHourlyChartFromDaily;
