const express = require("express");
const router = express.Router();
const coinsRouter = require("./coins");
const trendsRouter = require("./trends");


router.use("/api/v1", coinsRouter);
router.use("/api/v1", trendsRouter);
router.use(
  express.Router().get("/api/v1/*", async (req, res) => {
    res.status(404).send("Not found!");
  })
);

module.exports = router;
