const Queue = require("bull");
const logger = require("./../services/logger");
const keywords = require("./../../data/keywords.json");
const { getGoogleTrendsDataOneByOne } = require("../services/google-trends");
const printFinalReport = require("../services/google-trends/utils/print-final-report");

const updateDailyTrendsQueue = new Queue(
  "update-daily-trends-queue",
  process.env.REDIS_URI
);

updateDailyTrendsQueue.process("once", async (job) => {
  const {
    data: { minsToComplete },
  } = job;
  const jobsDelay = Math.floor((minsToComplete * 60 * 1000) / keywords.length);
  logger.info(
    `[job]: scheduling for ${keywords.length} keywords in ${minsToComplete} minutes - jobsDelay: ${jobsDelay} ms`
  );
  const results = await getGoogleTrendsDataOneByOne({
    timeSpan: "day",
    minsToComplete,
  });
  return results;
});

updateDailyTrendsQueue.process("schedule", async (job) => {
  const {
    data: { minsToComplete, jobsOptions },
  } = job;
  logger.info(
    `[SCHEDULER]: setting regular job to update weekly trends every ${
      jobsOptions.repeat.every / (1000 * 60)
    } minutes`
  );

  const scheduledJob = await updateDailyTrendsQueue.add(
    "once",
    { minsToComplete },
    jobsOptions
  );
  return scheduledJob;
});

updateDailyTrendsQueue.on("completed", (job, result) => {
  if (job.name === "once") {
    logger.info(`[job]: daily trends updated. job id:[${job.id}]`);
  } else {
    logger.info(
      `[SCHEDULER]: job "${job.name}" with id ${job.id}: daily trends updated`
    );
    printFinalReport(result, "daily trends");
  }
});

updateDailyTrendsQueue.on("failed", (job, error) => {
  logger.error(
    `[SCHEDULER]: job "${job.name}" with id ${job.id}: unable to schedule`
  );
});

module.exports = updateDailyTrendsQueue;
