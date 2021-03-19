const scheduler = require("node-cron");
const updateCookieQueue = require("../queues/update-cookie-queue");
const updateCookies = require("./update-cookies");
const schedulerOptions = { timezone: "Etc/UTC" };

const run = async () => {
  console.log("running jobs...");
  await updateCookieQueue.empty();
  await updateCookies(5);
  scheduler.schedule(
    "12 */4 * * *",
    updateCookies.bind(null, 60 * 4),
    schedulerOptions
  );
};

module.exports = { run };
