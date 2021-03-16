const logger = require("../logger");
const Normalization = require("./Normalization");

const FIVE_MINS = 5 * 60;

const saveNormalizationSampleForChecking = async (sample) => {
  try {
    const reportTime = sample.timelineData[sample.timelineData.length - 1].time;
    if (reportTime % FIVE_MINS === 0) {
      await Normalization.create(sample);
      logger.info(`saved normalization sample to mongodb.`);
    }
  } catch (err) {
    logger.error(`[Error in saving normalization sample]: ${err.message}`);
  }
};

module.exports = saveNormalizationSampleForChecking;
