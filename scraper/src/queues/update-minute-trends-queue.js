const Queue = require("bull");
const logger = require("../services/logger");
const keywords = require("../services/keywords");
const { getGoogleTrendsDataOneByOne } = require("../services/google-trends");
const printFinalReport = require("../services/google-trends/utils/print-final-report");

const updateMinuteTrendsQueue = new Queue("update-daily-trends-queue-2Hour", process.env.REDIS_URI, {
  settings: {
    stalledInterval: 0,
  },
});

updateMinuteTrendsQueue.process("once", async (job) => {
  const {
    data: { minsToComplete, scheduler, timeSpan },
  } = job;

  const jobsDelay = Math.floor((minsToComplete * 60 * 1000) / keywords.length);
  logger.info(
    `[job]: scheduling for ${keywords.length} keywords in ${minsToComplete} minutes - jobsDelay: ${jobsDelay} ms`
  );
  logger.info(`scheduler: ${scheduler}`);
  const results = await getGoogleTrendsDataOneByOne({
    timeSpan,
    minsToComplete,
    compareWith: timeSpan === "day" ? "arweave" : "", // The 12-hour interval Q is daily and compareWith(arweave), The other one doen't have compareWith
    scheduler,
    normalize: false,
  });
  return results;
});

updateMinuteTrendsQueue.process("schedule", async (job) => {
  const {
    data: { minsToComplete, jobsOptions, timeSpan },
  } = job;
  logger.info(
    `[SCHEDULER]: setting regular job to update minute trends every ${
      jobsOptions.repeat.every / (1000 * 60)
    } minutes`
  );
    // console.log("timeSpan123", timeSpan);

  const scheduledJob = await updateMinuteTrendsQueue.add(
    "once",
    { minsToComplete, scheduler: job.id, timeSpan },
    jobsOptions
  );
  return scheduledJob;
});

updateMinuteTrendsQueue.on("completed", (job, result) => {
  if (job.name === "once") {
    logger.info(`[job]: minute trends updated. job id:[${job.id}]`);
    printFinalReport(result, "minute trends");
  } else {
    logger.info(`[SCHEDULER]: job "${job.name}" with id ${job.id}: minute trends updated`);
  }
});

updateMinuteTrendsQueue.on("failed", (job, error) => {
  logger.error(`[SCHEDULER]: job "${job.name}" with id ${job.id}: ${error.message}`);
  console.error(error);
});

module.exports = updateMinuteTrendsQueue;
