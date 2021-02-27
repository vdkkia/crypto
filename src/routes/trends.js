const express = require("express");
const router = express.Router();
const trendController = require("../core/controllers/trendController");
const auth = require("../middlewares/auth");

router.get("/interestOverTime", async (req, res) => {
  const { coin, period } = req.query;
  res.json(await trendController.interestOverTime(coin.split(","), period));
});

router.get("/dailyTrends", async (req, res) => {
  const { period } = req.query;
  res.json(await trendController.dailyTrends(period));
});

router.get("/interestByRegion", async (req, res) => {
  const { coin, period } = req.query;
  res.json(await trendController.interestByRegion(coin, period));
});

router.get("/relatedQueries", async (req, res) => {
  const { coin, period } = req.query;
  res.json(await trendController.relatedQueries(coin, period));
});

router.get("/normalizedData", async (req, res) => {
  const { coin, mins } = req.query;
  res.json(await trendController.getNormalizeData(coin, mins));
});

module.exports = router;
