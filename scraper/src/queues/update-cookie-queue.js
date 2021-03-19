const Queue = require("bull");

const updateCookieQueue = new Queue(
  "update-cookie-queue",
  process.env.REDIS_URI
);

updateCookieQueue.process(async (job) => {
  console.log(job.data);
  console.log(`adding cookie`);
});

module.exports = updateCookieQueue;
