const cron = require("node-cron");
const logger = require("../logger");
const jobs = require("../jobs");

const schedule = (cronExpression, job) => {
  return cron.schedule(cronExpression, job, {
    scheduled: true,
    timezone: "Asia/Tehran",
  });
};

const jobRunner = {
  start: () => {
    try {
      let tasks = [];
      // Every 3 hours (Trend result is 4 hours >> 1 hour overlap)
      // At minute 0 past every 3rd hour.
      tasks.push(schedule("*/3 * * * *", jobs.getTrend));
      tasks.forEach((x) => x.stop());
      tasks.forEach((x) => x.start());
      logger.info(`${tasks.length} jobs were scheduled.`);
    } catch (e) {
      logger.error("Error in job scheduling: " + e);
    }
  },
  manualRun: () => jobs.getTrend(),
};

module.exports = jobRunner;
