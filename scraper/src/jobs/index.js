const updateDailyTrendsQueue = require("../queues/update-daily-trends-queue");
const updateMinuteTrendsQueue = require("../queues/update-minute-trends-queue");

const REPEAT_EVERY_MS = process.env.NODE_ENV === "production" ? 8 * 60 * 1000 : 1 * 60 * 1000;
const MINS_TO_COMPLETE = process.env.NODE_ENV === "production" ? 5 : 1;

const MINUTE_TREND_REPEAT_EVERY_MS = process.env.NODE_ENV === "production" ? 2 * 3600 * 1000 : 1 * 60 * 1000;
const MINUTE_TREND_MINS_TO_COMPLETE = process.env.NODE_ENV === "production" ? 100 : 1; //120 mins interval, use 100 mins to ensure completion

const MINUTE_TREND_REPEAT_EVERY_MS_2 =
  process.env.NODE_ENV === "production" ? 12 * 3600 * 1000 : 1 * 60 * 1000;
const MINUTE_TREND_MINS_TO_COMPLETE_2 = process.env.NODE_ENV === "production" ? 600 : 1; //12 hours interval, use 600 mins to ensure completion

const jobsOptions = {
  removeOnComplete: true,
  removeOnFail: true,
};

const run = async () => {
  // // await updateDailyTrendsQueue.obliterate({ force: true });
  // await updateDailyTrendsQueue.empty();
  // await updateDailyTrendsQueue.clean(60 * 60 * 1000);
  // setInterval(() => {
  //   updateDailyTrendsQueue.clean(60 * 60 * 1000);
  // }, 60 * 60 * 1000);
  // const repJobs = await updateDailyTrendsQueue.getRepeatableJobs();
  // await Promise.all(repJobs.map((j) => updateDailyTrendsQueue.removeRepeatableByKey(j.key)));

  // await updateDailyTrendsQueue.add(
  //   "once",
  //   { minsToComplete: MINS_TO_COMPLETE, scheduler: "first-time" },
  //   jobsOptions
  // );

  // await updateDailyTrendsQueue.add(
  //   "schedule",
  //   {
  //     minsToComplete: MINS_TO_COMPLETE,
  //     jobsOptions: { ...jobsOptions, repeat: { every: REPEAT_EVERY_MS } },
  //   },
  //   { delay: REPEAT_EVERY_MS }
  // );

  //=============================minute trends 2-hour======================================
  await updateMinuteTrendsQueue.empty();
  await updateMinuteTrendsQueue.clean(60 * 60 * 1000);
  setInterval(() => {
    updateMinuteTrendsQueue.clean(60 * 60 * 1000);
  }, 60 * 60 * 1000);
  const minuteRepJobs = await updateMinuteTrendsQueue.getRepeatableJobs();
  await Promise.all(minuteRepJobs.map((j) => updateMinuteTrendsQueue.removeRepeatableByKey(j.key)));

  await updateMinuteTrendsQueue.add(
    "once",
    { minsToComplete: MINUTE_TREND_MINS_TO_COMPLETE, scheduler: "first-time", timeSpan: "4hours" },
    jobsOptions
  );

  await updateMinuteTrendsQueue.add(
    "schedule",
    {
      minsToComplete: MINUTE_TREND_MINS_TO_COMPLETE,
      jobsOptions: { ...jobsOptions, repeat: { every: MINUTE_TREND_REPEAT_EVERY_MS } },
      timeSpan: "4hours",
    },
    { delay: MINUTE_TREND_REPEAT_EVERY_MS }
  );

  //=============================minute trends 12-hour======================================
  await updateMinuteTrendsQueue.add(
    "once",
    { minsToComplete: MINUTE_TREND_MINS_TO_COMPLETE_2, scheduler: "first-time", timeSpan: "day" },
    jobsOptions
  );

  await updateMinuteTrendsQueue.add(
    "schedule",
    {
      minsToComplete: MINUTE_TREND_MINS_TO_COMPLETE_2,
      jobsOptions: { ...jobsOptions, repeat: { every: MINUTE_TREND_REPEAT_EVERY_MS_2 } },
      timeSpan: "day",
    },
    { delay: MINUTE_TREND_REPEAT_EVERY_MS_2 }
  );
};

module.exports = { run };
