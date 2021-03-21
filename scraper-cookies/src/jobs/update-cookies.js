const updateCookieQueue = require("../queues/update-cookie-queue");
const logger = require("./../services/logger");

const cookieStockSize =
  process.env.NODE_ENV === "production" ? process.env.COOKIE_STOCK_SIZE : 40;

const updateCookies = async (minutesToComplete = 60 * 2) => {
  
  const jobDelay = (minutesToComplete * 60 * 1000) / cookieStockSize;
  logger.info(
    `adding ${cookieStockSize} cookies in ${minutesToComplete} minutes - jobDelay: ${jobDelay} ms`
  );
  for (let i = 0; i < cookieStockSize; i++) {
    await updateCookieQueue.add({ index: i }, { delay: jobDelay * i });
  }
};

module.exports = updateCookies;
