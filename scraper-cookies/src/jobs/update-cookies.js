const updateCookieQueue = require("../queues/update-cookie-queue");
const logger = require("./../services/logger");

const updateCookies = async (minutesToComplete = 60 * 2) => {
  logger.info(
    `adding ${process.env.COOKIE_STOCK_SIZE} cookies in ${minutesToComplete} minutes`
  );

  const numOfCookies = process.env.COOKIE_STOCK_SIZE;
  const jobDelay = (minutesToComplete * 60 * 1000) / numOfCookies;
  for (let i = 0; i < numOfCookies; i++) {
    await updateCookieQueue.add({ index: i }, { delay: jobDelay * i });
  }
};

module.exports = updateCookies;
