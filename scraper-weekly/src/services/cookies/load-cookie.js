const redis = require("./../../adapters/redis");
const COOKIE_REDIS_KEY_PREFIX = "GOOGLE_TRENDS_COOKIE:";

const loadCookie = (index) =>
  redis.client().get(`${COOKIE_REDIS_KEY_PREFIX}${index}`);

module.exports = loadCookie;
