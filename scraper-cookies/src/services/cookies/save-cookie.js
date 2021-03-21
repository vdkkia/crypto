const redis = require("./../../adapters/redis");

const COOKIE_REDIS_KEY_PREFIX = "GOOGLE_TRENDS_COOKIE:";
const TWO_DAYS = 2 * 24 * 60 * 60;

const saveCookie = async ({ index, cookie }) => {
  if (!cookie) throw new Error("cookie is empty");
  return redis
    .client()
    .set(`${COOKIE_REDIS_KEY_PREFIX}${index}`, cookie, "ex", TWO_DAYS);
};

module.exports = saveCookie;
