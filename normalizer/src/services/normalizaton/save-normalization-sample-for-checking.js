const logger = require("../logger");
const Normalization = require("./Normalization");

const SAMPLING_SECONDS = 30 * 60;

const saveNormalizationSampleForChecking = async (sample) => {
  try {
    const reportTime = Number(sample.timelineData[sample.timelineData.length - 1].time);
    if (reportTime % SAMPLING_SECONDS === 0) {
      await Normalization.create(sample);
      logger.info(`saved normalization sample to mongodb.`);
    }
  } catch (err) {
    logger.error(`[Error in saving normalization sample]: ${err.message}`);
  }
};

module.exports = saveNormalizationSampleForChecking;
