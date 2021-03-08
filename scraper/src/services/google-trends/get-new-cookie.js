const getTimelineDataKey = require("./get-timeline-data-key");
const waitForMs = require("./utils/wait-for-ms");
const logger = require("./../logger");

const FOUR_HOUR = 60 * 60 * 1000 * 4;
const MAX_TRIES = 500;
const keywords = ["Creditcoin", "Velas"];

const getNewCookie = async ({ proxyUri = process.env.PROXY_URI } = {}) => {
  logger.info(`getting new cookie for ${proxyUri}`);
  let cookie;
  let totalTries = 0;

  do {
    try {
      await waitForMs(100);
      await getTimelineDataKey({
        cookie: null,
        keywords,
        startTime: new Date(Date.now() - FOUR_HOUR),
        granularTimeResolution: true,
        proxyUri,
        log: false,
      });
    } catch (err) {
      if (
        err?.response?.status === 429 &&
        err?.response?.headers &&
        err?.response?.headers["set-cookie"]
      ) {
        try {
          cookie = err.response.headers["set-cookie"][0].split(";")[0];
        } catch (err) {}
      }
    }
    totalTries += 1;
  } while (!cookie && totalTries < MAX_TRIES);
  if (cookie) {
    logger.info(`got new cookie for ${proxyUri}`);
  } else {
    logger.info(`failed to new cookie for ${proxyUri}`);
  }
  return cookie;
};

module.exports = getNewCookie;
