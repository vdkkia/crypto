const { loadWeeklyTrendForKeyword } = require("../weekly-trends");
const findScaleFactor = require("./find-scale-factor");

const updateDailyTrend = async ({
  keyword,
  reference,
  timelineData,
  averages,
}) => {
  console.log("processing daily trend");
  console.log(keyword);
  console.log(reference);
  console.log(averages);
  console.log(timelineData.length);
  const weeklyTrend = await loadWeeklyTrendForKeyword(keyword);
  const scaleFactor = findScaleFactor(weeklyTrend, timelineData);
  console.log(scaleFactor);
};

module.exports = updateDailyTrend;
