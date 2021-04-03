const updateDailyTrendsQueue = require("../queues/update-daily-trends-queue");

const REPEAT_EVERY_MS =
  process.env.NODE_ENV === "production" ? 8 * 60 * 1000 : 1 * 60 * 1000;
const MINS_TO_COMPLETE = process.env.NODE_ENV === "production" ? 5 : 1;

const jobsOptions = {
  removeOnComplete: true,
  removeOnFail: true,
};

const run = async () => {
  // await updateDailyTrendsQueue.obliterate({ force: true });
  await updateDailyTrendsQueue.empty();
  await updateDailyTrendsQueue.clean(60 * 60 * 1000);
  setInterval(() => {
    updateDailyTrendsQueue.clean(60 * 60 * 1000);
  }, 60 * 60 * 1000);
  const repJobs = await updateDailyTrendsQueue.getRepeatableJobs();
  await Promise.all(
    repJobs.map((j) => updateDailyTrendsQueue.removeRepeatableByKey(j.key))
  );

  await updateDailyTrendsQueue.add(
    "once",
    { minsToComplete: MINS_TO_COMPLETE, scheduler: "first-time" },
    jobsOptions
  );

  await updateDailyTrendsQueue.add(
    "schedule",
    {
      minsToComplete: MINS_TO_COMPLETE,
      jobsOptions: { ...jobsOptions, repeat: { every: REPEAT_EVERY_MS } },
    },
    { delay: REPEAT_EVERY_MS }
  );
};

module.exports = { run };
