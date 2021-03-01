"use strict";
const api = require("./api");
const request = require("./request");
const {
  getInterestResults,
  getTrendingResults,
  constructInterestObj,
  constructTrendingObj,
} = require("./utilities");

const interestHandler = {
  processor: getInterestResults,
  objectConstructor: constructInterestObj,
};

const trendHandler = {
  processor: getTrendingResults,
  objectConstructor: constructTrendingObj,
};

const apiRequest = api.bind(this, request);

module.exports = {
  autoComplete: apiRequest("Auto complete", interestHandler),
  dailyTrends: apiRequest("Daily trends", trendHandler),
  interestByRegion: apiRequest("Interest by region", interestHandler),
  interestOverTime: apiRequest("Interest over time", interestHandler),
  realTimeTrends: apiRequest("Real time trends", trendHandler),
  relatedQueries: apiRequest("Related queries", interestHandler),
  relatedTopics: apiRequest("Related topics", interestHandler),
};
