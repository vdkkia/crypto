const logger = require("../logger");
const { db } = require("../../adapters/postgres");
const coins = require("./../../../data/new_coins.json");
const Bottleneck = require("bottleneck");
const PAGE_SIZE = 10;

const processMovingAverage = async (page) => {
  const secondsToComplete = 1;
  const msBetweenReqs = Math.ceil((secondsToComplete * 1000) / coins.length);
  const limiter = new Bottleneck({
    minTime: msBetweenReqs,
    maxConcurrent: process.env.MAX_CONCURRENCY,
  });
  const throttledQuery = limiter.wrap(_process);
  const promises = [];
  const start = Math.min((page - 1) * PAGE_SIZE, coins.length - 1);
  const end = Math.min(page * PAGE_SIZE, coins.length);
  for (let i = start; i < end; i++) {
    promises.push(
      throttledQuery({
        keyword: coins[i].term,
      })
    );
  }
  return await Promise.all(promises);
};

const _process = async ({ keyword }) => {
  try {
    const movingAverageWindowQuery = `SELECT (SELECT AVG(s) FROM UNNEST(interest_values) s) as AVG1 FROM dailies WHERE LOWER(keyword)=LOWER('${keyword}') ORDER BY CAST(report_time AS INTEGER) DESC limit 1`;
    const movingAverageSizeQuery = `SELECT (SELECT AVG(s) FROM UNNEST(interest_values) s) as AVG2 from weeklies WHERE LOWER(keyword)=LOWER('${keyword}') ORDER BY CAST(report_time AS INTEGER) DESC limit 1`;
    const _ratio = db.query(
      `WITH daily AS (${movingAverageWindowQuery}), weekly AS (${movingAverageSizeQuery}) SELECT` +
        ` CASE WHEN CAST((SELECT AVG2 FROM weekly) AS FLOAT) > 0 THEN CAST((SELECT AVG1 FROM daily) AS FLOAT)/CAST((SELECT AVG2 FROM weekly) AS FLOAT) ELSE 0 END AS RESULT`
    );

    const _values = db.query(
      `SELECT interest_values, report_time FROM weeklies WHERE LOWER(keyword)=LOWER('${keyword}') ORDER BY CAST(report_time AS INTEGER) DESC limit 1`
    );
    const [ratio, values] = await Promise.all([_ratio, _values]);
    logger.info(`keyword: ${keyword}, ratio: ${ratio[0].result}`);
    return {
      keyword,
      ratio: parseFloat(ratio[0].result),
      interest_values: values[0]?.interest_values,
      report_time: values[0]?.report_time,
    };
  } catch (e) {
    logger.error(`${e}`);
    return { keyword, ratio: 0 };
  }
};

const getCoinWeeklyData = async (page = 1) => {
  let res = await processMovingAverage(page);
  res.sort((a, b) => {
    if (a.ratio > b.ratio) return 1;
    else if (a.ratio < b.ratio) return -1;
    else return 0;
  });

  const data = res.map((item) => {
    return {
      trends: item.interest_values,
      time: item.interest_values
        ? item.interest_values.map(
            (x, i) => item.report_time - (item.interest_values.length - i) * 60 * 60 * 1000
          )
        : [],
      coin: coins.find((m) => m.term == item.keyword)?.id,
    };
  });
  return data;
};

module.exports = { processMovingAverage, getCoinWeeklyData };
