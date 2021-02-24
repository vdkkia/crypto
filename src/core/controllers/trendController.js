const logger = require("../logger");
const googleTrends = require("google-trends-api");
const helper = require("../helpers");

// 100 is the most popularity
const interestOverTime = async (keyword, period) => {
  // period =< 4 ==> timeFrame: 1 minute
  // period > 4 ==> timeFrame: 8 minuts
  try {
    const res = await googleTrends.interestOverTime({
      keyword,
      startTime: helper.data.getProcessedDate(period),
      // timezone: 60,
      // category: 814, //Currencies & Foreign Exchange
      granularTimeResolution: true,
      // property: "youtube", //  enumerated string ['images', 'news', 'youtube' or 'froogle']
      // endTime: helper.data.getProcessedDate("3d"),
      // geo: 'US', //defaults to worldwide
    });
    // console.log(res)
    return JSON.parse(res).default.timelineData;
  } catch (e) {
    return e;
  }
};

const dailyTrends = async (period) => {
  try {
    const res = await googleTrends.dailyTrends({
      trendDate: helper.data.getProcessedDate(period),
      geo: "US",
    });
    return JSON.parse(res);
  } catch (e) {
    return e;
  }
};

const interestByRegion = async (keyword, period) => {
  try {
    const res = await googleTrends.interestByRegion({
      keyword,
      resolution: "COUNTRY",
      startTime: helper.data.getProcessedDate(period),
    });
    return JSON.parse(res);
  } catch (e) {
    return e;
  }
};

const relatedQueries = async (keyword, period) => {
  try {
    const res = await googleTrends.relatedQueries({
      keyword,
      startTime: helper.data.getProcessedDate(period),
      // category: 814,//Currencies & Foreign Exchange
      // endTime:
      // geo:
    });
    return JSON.parse(res);
  } catch (e) {
    return e;
  }
};

googleTrends.relatedQueries({ keyword: "Westminster Dog Show" });

module.exports = {
  interestOverTime,
  dailyTrends,
  interestByRegion,
  relatedQueries,
};
