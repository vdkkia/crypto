const Queue = require("bull");
const logger = require("./../services/logger");
const saveTimeline = require("./../services/timelines/save-timeline");

const saveTimelineQueue = new Queue(
  "save-timeline-queue",
  process.env.REDIS_URI
);

saveTimelineQueue.process(async (job) => {
  try {
    // const timeline = await saveTimeline(job.data);
    // // console.log(job.data);
    // console.log("done");
  } catch (err) {
    logger.error(err.message);
  }
});

module.exports = saveTimelineQueue;
