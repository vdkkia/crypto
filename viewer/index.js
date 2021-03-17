const { db, pgp } = require("./src/adapters/postgres");
const path = require("path");
const scheduler = require("node-cron");
const logger = require("./src/services/logger");
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
    const a = await db.any("SELECT TOP 10 FROM cointerests");
    console.log(a);

    // scheduler.schedule("0 */2 * * *", updateCookieStock);
    // scheduler.schedule("* * * * *", processGoogleTrendsForAllKeywords);
    // scheduler.schedule("0 */1 * * *", processWeeklyTrends);
    // await processGoogleTrendsForAllKeywords();
    // await processWeeklyTrends();
    // logger.info("All jobs are running");
  } catch (err) {
    logger.error(err.message);
  }
})();
