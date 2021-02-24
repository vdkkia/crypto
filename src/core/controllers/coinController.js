const logger = require("../logger");
const axios = require("axios");

const coinData = async (coin) => {
  try {
    const res = await axios.get(`https://api.coinstats.app/public/v1/coins/${coin}?currency=EUR`);
    return res.data;
  } catch (e) {
    return e;
  }
};

const coinPrice = async (coin, period) => {
  try {
    const res = await axios.get(`https://api.coinstats.app/public/v1/charts?period=${period}&coinId=${coin}`);
    return res.data.chart;
  } catch (e) {
    return e;
  }
};

module.exports = {
  coinData,
  coinPrice,
};