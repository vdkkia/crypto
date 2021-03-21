const Queue = require("bull");

const updateWeeklyTrendForKeywordQueue = require("./update-weekly-trend-for-keyword-queue");
const keywords = require("./../services/keywords");
const logger = require("../services/logger");

const updateWeeklyTrendsQueue = new Queue(
  "update-weekly-trends-queue",
  process.env.REDIS_URI
);

updateWeeklyTrendsQueue.process("once", async (job) => {
  const {
    data: { minsToComplete },
  } = job;

  const jobsDelay = Math.floor((minsToComplete * 60 * 1000) / keywords.length);
  logger.info(
    `[SCHEDULER]: scheduling for ${keywords.length} keywords in ${minsToComplete} minutes - jobsDelay: ${jobsDelay} ms`
  );

  for (let i = 0; i < keywords.length; i++) {
    await updateWeeklyTrendForKeywordQueue.add(
      { index: i, keyword: keywords[i], totalKeywords: keywords.length },
      { delay: jobsDelay * i, removeOnComplete: true, removeOnFail: false }
    );
  }

  return keywords.length;
});

updateWeeklyTrendsQueue.process("schedule", async (job) => {
  const {
    data: { minsToComplete, jobsOptions },
  } = job;
  logger.info(
    `[SCHEDULER]: setting regular job to update weekly trends every ${
      jobsOptions.repeat.every / (1000 * 60)
    } minutes`
  );
  const scheduledJob = await updateWeeklyTrendsQueue.add(
    "once",
    { minsToComplete },
    jobsOptions
  );
  return scheduledJob;
});

updateWeeklyTrendsQueue.on("completed", (job, result) => {
  logger.info(
    `[SCHEDULER]: job "${job.name}" with id ${job.id}: weekly trends updated`
  );
});

updateWeeklyTrendsQueue.on("failed", (job, error) => {
  logger.error(
    `[SCHEDULER]: job "${job.name}" with id ${job.id}: unable to schedule`
  );
});

module.exports = updateWeeklyTrendsQueue;
