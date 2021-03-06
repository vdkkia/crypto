const axios = require("axios");
const { getTimelineDataKey, fetchTimelineData } = require("../services/google-trends");
const getNewCookie = require("../services/google-trends/get-new-cookie");
const redis = require("../database/redis");
const FOUR_HOUR = 60 * 60 * 1000 * 4;
const GET_DATA_MAX_TRIES = process.env.GET_DATA_MAX_TRIES;
const trends = require("../models/trend");
const signalDetector = require("./signalDetector");

const getDataKey = async ({ jobNumber, totalJobs, logger, proxyUri, cookie, keywords }, totalTries = 0) => {
  try {
    logger.info(`getting data for job ${jobNumber}/${totalJobs}`);
    const timelineDataKey = await getTimelineDataKey({
      keywords,
      startTime: new Date(Date.now() - FOUR_HOUR),
      granularTimeResolution: true,
      proxyUri,
      cookie,
    });
    logger.info(`received key for job ${jobNumber}/${totalJobs}`);
    const timelineData = await fetchTimelineData(timelineDataKey);
    signalDetector(timelineData, logger);
    try {
      await trends.findOneAndUpdate(
        { keyword: keywords },
        { $push: { data: JSON.stringify(timelineData) } },
        { upsert: true }
      );
      logger.info(`${keywords} data was stored to DB successfully!`);
    } catch (err) {
      logger.error("DB error:" + err);
    }

    logger.info(`received data for job ${jobNumber}/${totalJobs}`);
    return true;
  } catch (err) {
    if (totalTries < GET_DATA_MAX_TRIES) {
      // acquire new cookie set
      logger.warn(`retrying job ${jobNumber}, proxy: ${proxyUri}`);
      const newCookie = await getNewCookie({ proxyUri });
      // Replace failed cookie set
      await redis.set(proxyUri, newCookie, 3600 * 4);
      // Retrying...
      return getDataKey({ jobNumber, totalJobs, logger, proxyUri, newCookie, keywords }, totalTries + 1);
    } else {
      if (axios.isCancel(err)) {
        logger.error(`job ${jobNumber} canceled`);
        logger.error(err.message);
      } else {
        logger.error(
          `job ${jobNumber} failed with status ${err?.response?.status} and code ${err.code} after ${GET_DATA_MAX_TRIES} tries.`
        );
        logger.error(err.message);
      }
      return false;
    }
  }
};

module.exports = getDataKey;
