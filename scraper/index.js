const db = require("./src/adapters/mongodb");
const path = require("path");
const redis = require("./src/adapters/redis");
const scheduler = require("node-cron");
const logger = require("./src/services/logger");
const updateCookieStock = require("./src/services/cookies/update-cookie-stock");
const processGoogleTrendsForAllKeywords = require("./src/services/google-trends/process-google-trends-for-all-keywords");
const { processWeeklyTrends, getCoinWeeklyData } = require("./src/services/weeklyCompare");
const EXPRESS_PORT = process.env.EXPRESS_PORT;
const express = require("express");
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("./public"));

app.get("/", async (req, res) => {
  res.render("pages/default", { data: await getCoinWeeklyData() });
});
app.listen(EXPRESS_PORT, () => {
  require("./src/services/logger").info(`Server is listening to port ${EXPRESS_PORT}`);
});

(async () => {
  try {
    await redis.init();
    await db.init();
    await updateCookieStock(false);
    // scheduler.schedule("0 */2 * * *", updateCookieStock);
    // scheduler.schedule("* * * * *", processGoogleTrendsForAllKeywords);
    // scheduler.schedule("0 */1 * * *", processWeeklyTrends);

    // await processGoogleTrendsForAllKeywords();
    // await processWeeklyTrends();
    logger.info("All jobs are running");
  } catch (err) {
    logger.error(err.message);
  }
})();
