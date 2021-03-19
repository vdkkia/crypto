const buildHourlyChartFromDailyTrend = (timelineData) => {
  const hourlyValues = timelineData.reduce((acc, dp, i) => {
    const ts = Number(dp.time);
    const hourlyTimestamp = Math.floor(ts / 3600) * 3600;
    const totalPointsInHour = (hourlyTimestamp / 3600) % 2 === 0 ? 8 : 7;
    const indexInHour = Math.floor(1 + (ts - hourlyTimestamp) / 480);
    const remainingPoints = totalPointsInHour - indexInHour;
    // console.log(
    //   `${ts} => ${hourlyTimestamp} - ${indexInHour}/${totalPointsInHour} - ${remainingPoints} - ${dp.value[0]}`
    // );

    let addToCurrent = dp.value[0];
    let addToNext = null;
    let addCountCurrent = 2;
    let addCountNext = 0;

    if (remainingPoints === 0 && totalPointsInHour === 8) {
      addToCurrent = dp.value[0] / 2.0;
      addToNext = dp.value[0] / 2.0;
      addCountCurrent = 1;
      addCountNext = 1;
    }

    const newDatapoints = {};

    if (addToNext !== null) {
      newDatapoints[hourlyTimestamp + 3600] = {
        count: addCountNext,
        value: addToNext,
      };
    }

    newDatapoints[hourlyTimestamp] =
      hourlyTimestamp in acc
        ? {
            ...acc[hourlyTimestamp],
            count: acc[hourlyTimestamp].count + addCountCurrent,
            value: acc[hourlyTimestamp].value + addToCurrent,
          }
        : {
            count: addCountCurrent,
            value: addToCurrent,
          };

    return { ...acc, ...newDatapoints };
  }, {});
  return hourlyValues;
};

module.exports = buildHourlyChartFromDailyTrend;
