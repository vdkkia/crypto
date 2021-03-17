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

  const throttledQuery = limiter.wrap(_process);
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

const _process = async ({ keyword, movingAverageWindow, movingAverageSize }) => {
  try {
    const movingAverageWindowQuery = `SELECT AVG("INTEREST") AS AVG1 FROM cointerests WHERE LOWER("KEYWORD")=LOWER('${keyword}') limit ${movingAverageWindow}`;
    const movingAverageSizeQuery = `SELECT AVG("INTEREST") AS AVG2 FROM cointerests WHERE LOWER("KEYWORD")=LOWER('${keyword}') limit ${movingAverageSize}`;
    const ratio = await db.any(
      `WITH daily AS (${movingAverageWindowQuery}), weekly AS (${movingAverageSizeQuery}) SELECT` +
        ` CASE WHEN CAST((SELECT AVG2 FROM weekly) AS FLOAT) > 0 THEN CAST((SELECT AVG1 FROM daily) AS FLOAT)/CAST((SELECT AVG2 FROM weekly) AS FLOAT) ELSE 0 END AS RESULT`
    );
    logger.info(`keyword: ${keyword}, ratio: ${ratio[0].result}`);
    return { keyword, ratio: parseFloat(ratio[0].result) };
  } catch (e) {
    logger.error("Error: " + e);
    return { keyword, ratio: 0 };
  }
};

const getCoinWeeklyData = async () => {
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const query =
    `SELECT moving_average."RATIO", "KEYWORD", array_agg("INTEREST" || ',' || "TIMESTAMP")` +
    ` FROM (SELECT * FROM cointerests WHERE "REPORT_TIME" >= ${lastWeek.getTime() / 1000}) AS X` +
    ` FULL OUTER JOIN moving_average USING("KEYWORD") GROUP BY "KEYWORD", moving_average."RATIO"` +
    ` ORDER BY nullif(moving_average."RATIO", 'NaN') DESC NULLS LAST`; //LIMIT 5
  const result = await db.query(query);
  const data = result.map((x) => ({
    trends: x.array_agg.map((t) => t.split(",")[0]),
    time: x.array_agg.map((t) => t.split(",")[1]),
    coin: coins.find((m) => m.keyword == x.KEYWORD)?.Symbol,
  }));
  return data;
};

module.exports = { processMovingAverage, getCoinWeeklyData };
