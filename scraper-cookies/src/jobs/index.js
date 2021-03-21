const scheduler = require("node-cron");
const updateCookieQueue = require("../queues/update-cookie-queue");
const updateCookies = require("./update-cookies");
const schedulerOptions = { timezone: "Etc/UTC" };

const MINS_TO_COMPLETE =
  process.env.NODE_ENV === "production" ? 60 * 4 - 10 : 4;

const run = async () => {
  await updateCookieQueue.obliterate({ force: true });
  // await updateCookieQueue.clean(1);
  // await updateCookieQueue.empty();
  await updateCookies(MINS_TO_COMPLETE);
  scheduler.schedule(
    "12 */4 * * *",
    updateCookies.bind(null, MINS_TO_COMPLETE),
    schedulerOptions
  );
};

module.exports = { run };
