const Queue = require("bull");
const saveCookie = require("../services/cookies/save-cookie");
const { getNewCookie } = require("../services/google-trends");
const logger = require("../services/logger");

const updateCookieQueue = new Queue(
  "update-cookie-queue",
  process.env.REDIS_URI
);

updateCookieQueue.process(async (job) => {
  const {
    data: { index },
  } = job;
  const cookie = await getNewCookie();
  await saveCookie({ index, cookie });
  logger.info(`cookie ${index} saved to redis`);

  return true;
});

module.exports = updateCookieQueue;
