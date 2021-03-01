const logger = require("../logger");
// const googleTrends = require("google-trends-api");
const googleTrends = require("../trendsAPI");
const helper = require("../helpers");
const trends = require("../../models/trend");
const slayer = require("slayer");

// const HttpsProxyAgent = require("https-proxy-agent");
// const proxyAgent = new HttpsProxyAgent("127.0.0.1:9050");

// 100 is the most popularity
const interestOverTime = async (keyword, period, agent) => {
  // period =< 4 ==> timeFrame: 1 minute
  // period > 4 ==> timeFrame: 8 minuts
  let res;
  try {
    res = await googleTrends.interestOverTime({
      keyword: keyword.includes(",") ? keyword.split(",") : keyword,
      startTime: helper.data.getProcessedDate(period),
      // timezone: 60,
      // category: 814, //Currencies & Foreign Exchange
      granularTimeResolution: true,
      // property: "youtube", //  enumerated string ['images', 'news', 'youtube' or 'froogle']
      // endTime: helper.data.getProcessedDate("3d"),
      // geo: 'US', //defaults to worldwide
      agent,
    });
    return JSON.parse(res).default.timelineData;
  } catch (e) {
    logger.error("Error: " + e + " keyword " + keyword + "  Host: " + agent.proxy.host);
    return null;
  }
};

// const dailyTrends = async (period) => {
//   try {
//     const res = await googleTrends.dailyTrends({
//       trendDate: helper.data.getProcessedDate(period),
//       geo: "US",
//     });
//     return JSON.parse(res);
//   } catch (e) {
//     return e;
//   }
// };

// const interestByRegion = async (keyword, period) => {
//   try {
//     const res = await googleTrends.interestByRegion({
//       keyword,
//       resolution: "COUNTRY",
//       startTime: helper.data.getProcessedDate(period),
//     });
//     return JSON.parse(res);
//   } catch (e) {
//     return e;
//   }
// };

// const relatedQueries = async (keyword, period) => {
//   try {
//     const res = await googleTrends.relatedQueries({
//       keyword,
//       startTime: helper.data.getProcessedDate(period),
//       // category: 814,//Currencies & Foreign Exchange
//       // endTime:
//       // geo:
//     });
//     return JSON.parse(res);
//   } catch (e) {
//     return e;
//   }
// };

// googleTrends.relatedQueries({ keyword: "Westminster Dog Show" });

// /// Shots is the number of 4-hour data
// /// e.g. shot == 8 >> 8 x 4-hour data (each with 1 hour overlap) >> 24 hours useful data
// const getNormalizeData = async (coin, shots) => {
//   let allData = (await trends.findOne({ keyword: coin })).data;
//   allData = allData.slice(-shots);
//   const firstShot = JSON.parse(allData[0]);
//   // let output = [firstShot];
//   let output = [];
//   output = output.concat(firstShot);
//   let reference = getReference(firstShot); // [{time:"", value:""}]
//   for (let i = 1; i < allData.length; i++) {
//     const nextShot = JSON.parse(allData[i]);
//     const item = nextShot.find((x) => x.time == reference.time);
//     const normCriteria = reference.value / item.value;
//     const normalizedShot = nextShot.map((x) => ({ time: x.time, value: x.value * normCriteria }));
//     output = output.concat(normalizedShot);
//     // output.push(normalizedShot)_
//     reference = getReference(normalizedShot);
//   }
//   return output;
// };

// const getNormalizeData = async (coin, mins) => {
//   let allData = (await trends.findOne({ keyword: coin })).data;
//   allData = allData.slice(-mins);
//   const firstShot = JSON.parse(allData[0]);
//   let output = [];
//   output = output.concat(firstShot);
//   let reference = firstShot[firstShot.length - 1]; // firstShot : [{"time":"1614422460","value":94},{"time":"1614422520","value":100}]
//   for (let i = 1; i < allData.length; i++) {
//     const nextShot = JSON.parse(allData[i]);
//     const lastOfNextShot = nextShot[nextShot.length - 1];
//     if (reference.value == 0) reference.value = 0.1;
//     if (nextShot[0].value == 0) nextShot[0].value = 0.1;
//     if (lastOfNextShot.value == 0) lastOfNextShot.value = 0.1;
//     const item = nextShot[0];
//     const normCriteria = reference.value / item.value;
//     const normalizedShot = { time: lastOfNextShot.time, value: lastOfNextShot.value * normCriteria };
//     output = output.concat(normalizedShot);
//     reference = normalizedShot;
//   }
//   return output;
// };

// const detectSpike = async (data) => {
//   const spikes = await slayer({ minPeakDistance: 100, minPeakHeight: 0 })
//     .y((item) => item.value)
//     .fromArray(data);
//   return spikes;
// };

// const getReference = (data) => {
//   for (let i = data.length - 1; i > 0; i--) {
//     if (data[i].value != 0) return data[i];
//   }
// };

module.exports = {
  interestOverTime,
  // dailyTrends,
  // interestByRegion,
  // relatedQueries,
  // getNormalizeData,
  // detectSpike,
};
