const updateDailyTrendsQueue = require("../queues/update-daily-trends-queue");

const REPEAT_EVERY_MS = 8 * 60 * 1000;
const MINS_TO_COMPLETE = 5;

const jobsOptions = {
  removeOnComplete: true,
  removeOnFail: false,
};

const run = async () => {
  await updateDailyTrendsQueue.empty();
  const repJobs = await updateDailyTrendsQueue.getRepeatableJobs();
  await Promise.all(
    repJobs.map((j) => updateDailyTrendsQueue.removeRepeatableByKey(j.key))
  );

  await updateDailyTrendsQueue.add(
    "once",
    { minsToComplete: MINS_TO_COMPLETE },
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
