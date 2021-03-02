const getInterestOverTimeKey = require("./src/services/google-trends/get-interest-over-time-key");

require("dotenv").config();
console.log('hi');

const FOUR_HOUR = 60 * 60 * 1000 * 4;

const keywords = ["Creditcoin", "Velas"];
const now = Date.now();


(async () => {

  console.log(process.env.NODE_ENV);

  try {
    const result = await getInterestOverTimeKey({
      keywords,
      startTime: new Date(now - FOUR_HOUR),
      granularTimeResolution: true,
    });
  } catch (err) {
    console.error('error');
  }
  
})();