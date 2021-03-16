const Queue = require("bull");
const logger = require("../services/logger");
const saveWeeklyTrends = require("../services/weeklyCompare/save-weekly-trends");

const saveWeeklyTrendsQueue = new Queue("save-weekly-trends-queue", process.env.REDIS_URI);

saveWeeklyTrendsQueue.process(async (job) => {
  try {
    await saveWeeklyTrends(job.data.keyword, job.data.data);
  } catch (err) {
    logger.error("Error: " + err.message);
  }
});

module.exports = saveWeeklyTrendsQueue;
