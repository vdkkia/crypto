const express = require("express");
const router = express.Router();
const trendController = require("../core/controllers/trendController");
const auth = require("../middlewares/auth");

router.get("/interestOverTime", async (req, res) => {
  const { keyword, period } = req.query;
  res.json(await trendController.interestOverTime(keyword, period));
});

router.get("/dailyTrends", async (req, res) => {
  const { period } = req.query;
  res.json(await trendController.dailyTrends(period));
});

router.get("/interestByRegion", async (req, res) => {
  const { keyword, period } = req.query;
  res.json(await trendController.interestByRegion(keyword, period));
});

router.get("/relatedQueries", async (req, res) => {
  const { keyword, period } = req.query;
  res.json(await trendController.relatedQueries(keyword, period));
});

module.exports = router;
