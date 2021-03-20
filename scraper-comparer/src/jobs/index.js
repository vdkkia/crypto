const updateWeeklyRefsQueue = require("./../queues/update-weekly-refs-queue");
const updateWeeklyRefForKeywordQueue = require("./../queues/update-weekly-ref-for-keyword-queue");

const REPEAT_EVERY_MS = 12 * 60 * 1000;
const MINS_TO_COMPLETE = 12 * 60 - 30;
const REF_KEYWORD = "arweave";

const jobsOptions = {
  removeOnComplete: true,
  removeOnFail: false,
};

const run = async () => {
  await updateWeeklyRefForKeywordQueue.empty();
  await updateWeeklyRefsQueue.empty();
  const repJobs = await updateWeeklyRefsQueue.getRepeatableJobs();
  await Promise.all(
    repJobs.map((j) => updateWeeklyRefsQueue.removeRepeatableByKey(j.key))
  );

  await updateWeeklyRefsQueue.add(
    "once",
    { minsToComplete: MINS_TO_COMPLETE, ref: REF_KEYWORD },
    jobsOptions
  );
  await updateWeeklyRefsQueue.add(
    "schedule",
    {
      minsToComplete: MINS_TO_COMPLETE,
      ref: REF_KEYWORD,
      jobsOptions: { ...jobsOptions, repeat: { every: REPEAT_EVERY_MS } },
    },
    { delay: REPEAT_EVERY_MS }
  );
};

module.exports = { run };
