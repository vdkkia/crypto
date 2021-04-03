const updateWeeklyTrendsQueue = require("./../queues/update-weekly-trends-queue");
const updateWeeklyTrendForKeywordQueue = require("./../queues/update-weekly-trend-for-keyword-queue");

const REPEAT_EVERY_MS =
  process.env.NODE_ENV === "production" ? 1 * 60 * 1000 : 60 * 1000;
const MINS_TO_COMPLETE = process.env.NODE_ENV === "production" ? 55 : 0.8;

const jobsOptions = {
  removeOnComplete: true,
  removeOnFail: true,
};

const run = async () => {
  // await updateWeeklyTrendsQueue.obliterate({ force: true });
  // await updateWeeklyTrendForKeywordQueue.obliterate({ force: true });
  await updateWeeklyTrendsQueue.empty();
  await updateWeeklyTrendForKeywordQueue.empty();
  await updateWeeklyTrendsQueue.clean(60 * 60 * 1000);
  await updateWeeklyTrendForKeywordQueue.clean(60 * 60 * 1000)

  setInterval(() => {
    updateWeeklyTrendsQueue.clean(60 * 60 * 1000);
  }, 60 * 60 * 1000);
  
  setInterval(() => {
    updateWeeklyTrendForKeywordQueue.clean(60 * 60 * 1000);
  }, 60 * 60 * 1000);
  const repJobs = await updateWeeklyTrendsQueue.getRepeatableJobs();
  await Promise.all(
    repJobs.map((j) => updateWeeklyTrendsQueue.removeRepeatableByKey(j.key))
  );

  await updateWeeklyTrendsQueue.add(
    "once",
    { minsToComplete: MINS_TO_COMPLETE },
    jobsOptions
  );
  await updateWeeklyTrendsQueue.add(
    "schedule",
    {
      minsToComplete: MINS_TO_COMPLETE,
      jobsOptions: { ...jobsOptions, repeat: { every: REPEAT_EVERY_MS } },
    },
    { delay: REPEAT_EVERY_MS }
  );
};

module.exports = { run };
