const axios = require("axios");
const sendDataForNormalization = async (payload) => {
  const { data } = axios.post(
    `${process.env.NORMALIZER_API_BASE_URI}/api/data`,
    payload
  );
  return data;
};

module.exports = sendDataForNormalization;
