const logger = require("../logger");
const getTimelineDataKey = require("../google-trends/get-timeline-data-key");
const fetchTimelineData = require("../google-trends/fetch-timeline-data");
const saveWeeklyTrendsQueue = require("./../../queues/save-weekly-trends-queue");
const weeklyTrendsModel = require("./weekly-trends-model");
const coins = require("./../../../data/coins.json");
const loadCookies = require("../cookies/load-cookies");
const Bottleneck = require("bottleneck");
const { ma, dma, ema, sma, wma } = require("moving-averages");

const THREE_DAYS = 3 * 24 * 3600 * 1000;

const getWeeklyTrends = async ({ keyword, coinNumber, cookie, proxyUri = process.env.PROXY_URI }) => {
  try {
    logger.info(`getting weekly trends data for ${coinNumber}/${coins.length}: ${keyword}`);
    const keywords = [keyword, "arweave"];
    const timelineDataKey = await getTimelineDataKey({
      keywords,
      startTime: new Date(Date.now() - THREE_DAYS),
      granularTimeResolution: true,
      proxyUri,
      cookie,
    });
    let timelineData = await fetchTimelineData(timelineDataKey);
    timelineData = timelineData[timelineData.length - 1];
    saveWeeklyTrendsQueue.add({
      keyword,
      data: { value: timelineData.value[0], timeStamp: timelineData.time },
    });
    return 1;
  } catch (err) {
    logger.error(`job ${coinNumber} failed with status ${err?.response?.status} and code ${err?.code}.`);
    return 0;
  }
};

const processWeeklyTrends = async () => {
  try {
    const cookies = await loadCookies();
    const secondsToComplete = 180;
    const msBetweenReqs = Math.ceil((secondsToComplete * 1000) / coins.length);
    const limiter = new Bottleneck({
      minTime: msBetweenReqs,
      maxConcurrent: process.env.MAX_CONCURRENCY,
    });
    const throttledGetWeeklyTrends = limiter.wrap(getWeeklyTrends);
    const promises = [];
    for (let i = 0; i < coins.length; i++) {
      promises.push(
        throttledGetWeeklyTrends({
          coinNumber: i + 1,
          cookie: cookies[i % cookies.length],
          keyword: coins[i].keyword,
        })
      );
    }
    const results = await Promise.all(promises);
    logger.info(`Success rate: ${(results.reduce((t, i) => t + i) / coins.length) * 100}%`);
  } catch (err) {
    logger.error("Error: " + err);
  }
};

const getCoinWeeklyData = async () => {
  const trends = await weeklyTrendsModel.find({}, { data: { $slice: -(7 * 24) } });
  // Calculate the ma for all coins
  const MAs = [];

  trends.forEach((x) => {
    const _ma = ma(x.data, 2); // ma([1, 2, 3, 4, 5], 2)
    MAs.push(_ma);
  });
  // Sort based on ma result

  const data = trends.map((x) => ({
    trends: x.data.map((t) => t.value),
    timeStamp: x.data.map((t) => t.timeStamp),
    coin: coins.find((m) => m.keyword == x.keyword)?.Symbol,
  }));
  //   console.log(data)
  return data;
};

module.exports = { processWeeklyTrends, getCoinWeeklyData };
