#!/usr/bin/env node
require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("./src/middlewares/passport");
const app = express();
const router = require("./src/routes");
const cookieParser = require("cookie-parser");
const logger = require("./src/core/logger");
const db = require("./src/database/mongoDB");
const session = require("./src/middlewares/session");
const jobRunner = require("./src/core/jobRunner");
const trendsController = require("./src/core/controllers/trendController");

const coins = require("./src/models/coin");

app.use(
  cors({
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": "*",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

const server = app
  .listen(process.env.serverPort, async () => {
    await db.connect();
    jobRunner.manualRun();
    // jobRunner.start();

    // const data = await trendsController.getNormalizeData("Bitcoin", 10);
    // console.log(await trendsController.detectSpike(data));

    // const axios = require("axios");
    // const res = await axios.get("https://api.coinstats.app/public/v1/coins");
    // console.log(res.data.coins);
    // res.data.coins.forEach(async (x) => {
    //   const { id, name, symbol, websiteUrl, redditUrl, twitterUrl } = x;
    //   await new coins({
    //     id,
    //     name,
    //     symbol,
    //     websiteUrl,
    //     redditUrl,
    //     twitterUrl,
    //   }).save();
    // });

    logger.info(`Server started on port:${process.env.serverPort}`);
  })
  .on("error", (err) => {
    logger.error("Error: " + err);
  });
app.use(router);
app.use(express.static(`${__dirname}/build`));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});

module.exports = { server, app };
