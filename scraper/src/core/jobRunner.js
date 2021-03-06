const cron = require("node-cron");
const loadCookieStock = require("./load-cookie-stock");
const scraper = require("./scraper");
const schedule = (cronExpression, job) => {
  return cron.schedule(cronExpression, job, {
    scheduled: true,
    timezone: "Asia/Tehran",
  });
};
const jobRunner = {
  start: (logger) => {
    try {
      let tasks = [];
      tasks.push(schedule("0 */2 * * *", () => loadCookieStock(true)));
      tasks.push(schedule("* * * * *", () => scraper.run()));
      tasks.forEach((job) => job.stop());
      tasks.forEach((job) => job.start());
      logger.info(`${tasks.length} jobs were scheduled.`);
    } catch (e) {
      logger.error("Error in job scheduling: " + e);
    }
  },
  manualRun: () => scraper.run(),
};

module.exports = jobRunner;
