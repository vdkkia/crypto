const { 
  fetchTimelineData, 
  getInterestOverTimeKey, 
} = require('./src/services/google-trends');

require('dotenv').config();
console.log('hi');

const FOUR_HOUR = 60 * 60 * 1000 * 4;

const keywords = ['Creditcoin', 'Velas'];


(async () => {

  try {
    const now = Date.now();
    const interestDataKey = await getInterestOverTimeKey({
      keywords,
      startTime: new Date(now - FOUR_HOUR),
      granularTimeResolution: true,
    });

    console.log('got the key');

    const timelineData = await fetchTimelineData(interestDataKey);
    console.log('fetched timeline data:');
    console.log(timelineData);

  } catch (err) {
    console.log(err?.response?.status);
    console.error('error');
  }
  
})();