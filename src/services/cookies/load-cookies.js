const redis = require("../../database/redis");
const COOKIE_STOCK_REDIS_KEY = "GOOGLE_TRENDS_COOKIES";

const loadCookies = async () => {
  const stock = await redis.client().get(COOKIE_STOCK_REDIS_KEY);
  if (stock !== null) return JSON.parse(stock);
  return null;
};

module.exports = loadCookies;
