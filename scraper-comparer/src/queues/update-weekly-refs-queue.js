const Queue = require("bull");
const updateWeeklyRefForKeywordQueue = require("./update-weekly-ref-for-keyword-queue");
const keywords = require("./../services/keywords");

const logger = require("../services/logger");

const updateWeeklyRefsQueue = new Queue(
  "update-weekly-refs-queue",
  process.env.REDIS_URI
);

updateWeeklyRefsQueue.process("once", async (job) => {
  const {
    data: { minsToComplete, ref },
  } = job;

  const jobsDelay = Math.floor((minsToComplete * 60 * 1000) / keywords.length);
  logger.info(
    `[SCHEDULER]: scheduling for ${keywords.length} keywords in ${minsToComplete} minutes - jobsDelay: ${jobsDelay} ms`
  );
  for (let i = 0; i < keywords.length; i++) {
    await updateWeeklyRefForKeywordQueue.add(
      { index: i, keyword: keywords[i], totalKeywords: keywords.length, ref },
      { delay: jobsDelay * i, removeOnComplete: true, removeOnFail: false }
    );
  }

  return keywords.length;
});

updateWeeklyRefsQueue.process("schedule", async (job) => {
  const {
    data: { minsToComplete, jobsOptions, ref },
  } = job;
  logger.info(
    `[SCHEDULER]: setting regular job to update weekly refs every ${
      jobsOptions.repeat.every / (1000 * 60)
    } minutes`
  );
  const scheduledJob = await updateWeeklyRefsQueue.add(
    "once",
    { minsToComplete, ref },
    jobsOptions
  );
  return scheduledJob;
});

updateWeeklyRefsQueue.on("completed", (job, result) => {
  logger.info(
    `[SCHEDULER]: job "${job.name}" with id ${job.id}: weekly ref updated`
  );
});

updateWeeklyRefsQueue.on("failed", (job, errorMessage) => {
  logger.error(
    `[SCHEDULER]: job "${job.name}" with id ${job.id}: unable to update weekly ref`
  );
});

module.exports = updateWeeklyRefsQueue;
