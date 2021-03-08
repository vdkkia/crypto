const axios = require("axios");
const Queue = require("bull");

const sendAlertQueue = new Queue("send-alert-queue", process.env.REDIS_URI);

sendAlertQueue.process(async (job) => {
  const result = await axios.post(process.env.SLACK_INCOMING_WEBHOOK, job.data);
});

module.exports = sendAlertQueue;
