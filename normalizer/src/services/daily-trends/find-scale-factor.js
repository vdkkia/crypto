const buildHourlyChartFromDailyTrend = require("./build-hourly-chart-from-daily-trend");

const findScaleFactor = (weeklyTrend, dailyTrend) => {
  const hourlyValues = buildHourlyChartFromDailyTrend(dailyTrend);
  const commonHours = Object.keys(hourlyValues).filter(
    (ts) =>
      ts in weeklyTrend.timeMap &&
      hourlyValues[ts].count === 15 &&
      hourlyValues[ts].value !== 0 &&
      weeklyTrend.timeMap[ts].value !== 0
  );
  const scaleFactors = commonHours.map(
    (ts) => weeklyTrend.timeMap[ts].value / hourlyValues[ts].value
  );
  const scaleFactor =
    scaleFactors.reduce((tot, sf) => tot + sf, 0) / scaleFactors.length;
  return scaleFactor;
};

module.exports = findScaleFactor;
