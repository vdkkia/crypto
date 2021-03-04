const axios = require("axios");

const {
  getTimelineDataKey,
  fetchTimelineData,
} = require("../src/services/google-trends");

const keywords = ["Creditcoin", "Velas"];
const FOUR_HOUR = 60 * 60 * 1000 * 4;

const getDataKey = async ({
  jobNumber,
  totalJobs,
  logger,
  proxyUri,
  cookie,
}) => {
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
    logger.info(`received data for job ${jobNumber}/${totalJobs}`);
    // logger.info("\n\n" + JSON.stringify(timelineDataKey, null, 2));
    return true;
  } catch (err) {
    if (axios.isCancel(err)) {
      logger.error(`job ${jobNumber} canceled`);
      logger.error(err.message);
    } else {
      logger.error(
        `job ${jobNumber} failed with status ${err?.response?.status} and code ${err.code}`
      );
      logger.error(err.message);
    }
    return false;
  }
};

module.exports = getDataKey;
