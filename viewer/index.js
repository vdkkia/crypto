const path = require("path");
const scheduler = require("node-cron");
const logger = require("./src/services/logger");
const { processMovingAverage, getCoinWeeklyData } = require("./src/services/weeklyCompare");
const express = require("express");
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("./public"));

app.get("/", async (req, res) => {
  res.render("pages/default", { data: await getCoinWeeklyData() });
});

app.listen(process.env.EXPRESS_PORT, () => {
  require("./src/services/logger").info(`Server is listening to port ${process.env.EXPRESS_PORT}`);
});

(async () => {
  try {
    scheduler.schedule("0 1 * * *", processMovingAverage);
    console.log(await getCoinWeeklyData());
  } catch (err) {
    logger.error(err.message);
  }
})();
