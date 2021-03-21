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

  return true;
});

updateCookieQueue.on("completed", (job, result) => {
  logger.info(`job ${job.id}: cookie ${job.data.index} saved to redis`);
});

updateCookieQueue.on("failed", (job, errorMessage) => {
  logger.error(`job ${job.id}: failed with result: ${errorMessage}`);
});

module.exports = updateCookieQueue;
