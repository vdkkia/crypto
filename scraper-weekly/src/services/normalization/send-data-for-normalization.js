const axios = require("axios");
const logger = require("./../logger");
const sendDataForNormalization = async (payload) => {
  try {
    const { data } = await axios.post(
      `${process.env.NORMALIZER_API_BASE_URI}/api/data`,
      payload
    );
    return data;
  } catch (err) {
    logger.error(`[Normalization Error]: ${err.message}`);
  }
};

module.exports = sendDataForNormalization;
