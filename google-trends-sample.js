const { 
  fetchTimelineData, 
  getTimelineDataKey,
  getNewCookie, 
} = require('./src/services/google-trends');

require('dotenv').config();

const FOUR_HOUR = 60 * 60 * 1000 * 4;

const keywords = ['Creditcoin', 'Velas'];


(async () => {

  try {
    // const now = Date.now();
    // const timelineDataKey = await getTimelineDataKey({
    //   keywords,
    //   startTime: new Date(now - FOUR_HOUR),
    //   granularTimeResolution: true,
    // });

    // console.log('got the key');

    // const timelineData = await fetchTimelineData(timelineDataKey);
    // console.log('fetched timeline data:');
    // console.log(timelineData);

    const cookie = await getNewCookie({ proxyUri: "http://pcvpttjl-dest:w0kgh6nois6f@185.102.49.38:6376" });
    console.log(cookie);

  } catch (err) {
    console.log(err?.response?.status);
    console.error('error');
  }
  
})();