const Queue = require("bull");
const saveAlert = require("./../services/alerts/save-alert");

const saveJumpsQueue = new Queue("save-jumps-queue");

saveJumpsQueue.process(async (job) => {
  const alert = await saveAlert(job.data);
});

module.exports = saveJumpsQueue;
