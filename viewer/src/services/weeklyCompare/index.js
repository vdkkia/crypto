const logger = require("../logger");
const { db, pgp } = require("../../adapters/postgres");
const coins = require("./../../../data/coins.json");
const Bottleneck = require("bottleneck");

const cs = new pgp.helpers.ColumnSet(["KEYWORD", "RATIO", "CALC_TIME"], { table: "moving_average" });

const testCoins = [
  { keyword: "SFP coin", symbol: "safepal" },
  { keyword: "SFT coin", symbol: "safex-token" },
];

const processMovingAverage = async () => {
  const secondsToComplete = 1;
  const msBetweenReqs = Math.ceil((secondsToComplete * 1000) / testCoins.length);
  const limiter = new Bottleneck({
    minTime: msBetweenReqs,
    maxConcurrent: process.env.MAX_CONCURRENCY,
  });

  const throttledQuery = limiter.wrap(process);
  const promises = [];
  for (let i = 0; i < testCoins.length; i++) {
    promises.push(
      throttledQuery({
        movingAverageWindow: 24 * 60,
        movingAverageSize: 7 * 24 * 60,
        keyword: testCoins[i].keyword,
      })
    );
  }
  const results = await Promise.all(promises);
  await saveMovingAverage(results);
};

const saveMovingAverage = async (records) => {
  const values = records.map((record) => ({
    KEYWORD: record.keyword,
    RATIO: record.ratio,
    CALC_TIME: Date.now(),
  }));
  const query = pgp.helpers.insert(values, cs);
  await db.none(query);
};

const process = async ({ keyword, movingAverageWindow, movingAverageSize }) => {
  try {
    const movingAverageWindowQuery = `SELECT AVG("INTEREST") FROM cointerests WHERE LOWER("KEYWORD")=LOWER('${keyword}') limit ${movingAverageWindow}`;
    const movingAverageSizeQuery = `SELECT AVG("INTEREST") FROM cointerests WHERE LOWER("KEYWORD")=LOWER('${keyword}') limit ${movingAverageSize}`;
    const ratio = await db.any(
      `WITH daily AS (${movingAverageWindowQuery}), weekly AS (${movingAverageSizeQuery}) SELECT CAST((SELECT * FROM daily) AS FLOAT) / CAST((SELECT * FROM weekly) AS FLOAT) AS result`
    );
    logger.info(`keyword: ${keyword}, ratio: ${ratio[0].result}`);
    return { keyword, ratio };
  } catch (e) {
    logger.error("Error: " + e);
    return { keyword, ratio: 0 };
  }
};

const getCoinWeeklyData = async () => {
  // const result = `SELECT * FROM moving_average ORDER BY time DESC, ratio DESC limit ${testCoins.length}`;

  // const query =
  //   "SELECT s.ratio, array_agg(g.INTEREST) as marks FROM moving_average s " +
  //   "LEFT JOIN cointerests g ON g.KEYWORD = s.KEYWORD GROUP BY s.KEYWORD";
  const today = new Date();
  const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

  const query =
    `SELECT "KEYWORD", array_agg('[' || "INTEREST" || ',' || "TIMESTAMP" || ']')` +
    ` FROM (SELECT * FROM cointerests WHERE "REPORT_TIME" <= ${lastWeek.getTime()}) AS X` +
    ` LEFT OUTER JOIN moving_average ON cointerests.KEYWORD = moving_average.KEYWORD GROUP BY "KEYWORD" limit 10 `;

  // const query = 'SELECT "KEYWORD"  FROM cointerests GROUP BY "KEYWORD" limit 10';
  const result = await db.query(query);
  // const data = result.map((x) => ({
  //   trends: x.data.map((t) => t.value),
  //   time: x.data.map((t) => t.timeStamp),
  //   coin: coins.find((m) => m.keyword == x.KEYWORD)?.Symbol,
  // }));

  return result;
};

module.exports = { processMovingAverage, getCoinWeeklyData };
