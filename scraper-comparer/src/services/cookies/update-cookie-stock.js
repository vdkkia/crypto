const redis = require("./../../adapters/redis");
const Bottleneck = require("bottleneck");
const loadCookies = require("./load-cookies");
const logger = require("./../logger");
const { getNewCookie } = require("./../google-trends");

const COOKIE_STOCK_REDIS_KEY = "GOOGLE_TRENDS_COOKIES";
const DELAY_BETWEEN_CALLS_MS = 100;
const MAX_CONCURRENCY = 50;
const TWO_DAYS = 2 * 24 * 60 * 60;
const COOKIE_STOCK_SIZE = process.env.COOKIE_STOCK_SIZE;

const limiter = new Bottleneck({
  minTime: DELAY_BETWEEN_CALLS_MS,
  maxConcurrent: MAX_CONCURRENCY,
});

const throttledGetNewCookie = limiter.wrap(getNewCookie);

const updateCookieStock = async (force = true) => {
  if (!force) {
    logger.info("checking cookie stock");
    const cookieStock = await loadCookies();
    if (cookieStock !== null) {
      logger.info(
        `already have ${cookieStock.length} cookies. If you want to force refresh, remove the second argument to the updateCookieStock method.`
      );
      return;
    }
  }
  logger.info("updating cookie stock");
  const jobPromises = [];
  for (let i = 0; i < COOKIE_STOCK_SIZE; i++) {
    jobPromises.push(throttledGetNewCookie());
  }
  const cookies = await Promise.all(jobPromises);
  logger.info(`got ${cookies.length} cookies.`);
  const isOk = await redis
    .client()
    .set(COOKIE_STOCK_REDIS_KEY, JSON.stringify(cookies), "ex", TWO_DAYS);
  logger.info(`new cookie stock saved to redis: ${isOk}`);
};

module.exports = updateCookieStock;
