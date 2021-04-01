require('dotenv').config();
const EXPRESS_PORT = process.env.EXPRESS_PORT;
const path = require("path");
const { getCoinWeeklyData } = require("./src/services/weeklyCompare");
const express = require("express");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.get("/", async (req, res) => {
  res.render("pages/default");
});

app.get("/list", async (req, res) => {
  const { page } = req.query;
  res.send(await getCoinWeeklyData(page));
});

app.listen(EXPRESS_PORT, () => {
  require("./src/services/logger").info(`Viewer server is listening to port ${EXPRESS_PORT}`);
});
