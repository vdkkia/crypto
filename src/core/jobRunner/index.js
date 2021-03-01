const cron = require("node-cron");
const logger = require("../logger");
const jobs = require("../jobs");
const proxyPool = require("../jobs/proxy");

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
      tasks.push(schedule("*/1 * * * *", jobs.groupRunner));
      tasks.push(schedule("0 * * * *", () => proxyPool.activate()));
      tasks.forEach((x) => x.stop());
      tasks.forEach((x) => x.start());
      logger.info(`${tasks.length} jobs were scheduled.`);
    } catch (e) {
      logger.error("Error in job scheduling: " + e);
    }
  },
  manualRun: () => jobs.groupRunner(),
};

module.exports = jobRunner;
