const weeklyTrendsModel = require("./weekly-trends-model");

const saveWeeklyTrends = (coin, data) =>
  weeklyTrendsModel.findOneAndUpdate({ keyword: coin }, { $push: { data } }, { upsert: true });

module.exports = saveWeeklyTrends;
