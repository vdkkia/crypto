const express = require("express");
const router = express.Router();
const coinController = require("../core/controllers/coinController");
const coins = require("../models/coin");
const auth = require("../middlewares/auth");

router.get("/coinData", async (req, res) => {
  const { coin } = req.query;
  res.send(await coinController.coinData(coin.toLowerCase()));
});

// available periods - 24h | 1w | 1m | 3m | 6m | 1y |all
router.get("/coinPrice", async (req, res) => {
  const { coin, period } = req.query;
  res.send(await coinController.coinPrice(coin.toLowerCase(), period));
});

router.get("/coins", async (req, res) => {
  const c = (await coins.find({}))
    .map((x) => {
      return {
        id: x.id,
        name: x.name,
        symbol: x.symbol,
      };
    })
    .sort((a, b) => {
      return a.symbol > b.symbol ? 1 : a.symbol < b.symbol ? -1 : 0;
    });
  res.send(c);
});

module.exports = router;
