const redis = require("./../../adapters/redis");
const COOKIE_REDIS_KEY_PREFIX = "GOOGLE_TRENDS_COOKIE:";

const loadCookie = (index) =>
  redis
    .client()
    .get(`${COOKIE_REDIS_KEY_PREFIX}${index % process.env.COOKIE_STOCK_SIZE}`);

module.exports = loadCookie;
