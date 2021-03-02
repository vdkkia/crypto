const axios = require("axios");
const ProxyAgent = require("proxy-agent");
const buildComparisonItem = require("./utils/build-comparison-item");

const getInterestOverTimeKey = async ({
  keywords,
  timezone = new Date().getTimezoneOffset(),
  category = 0,
  property = "",
  startTime = new Date("2004-01-01"),
  endTime = new Date(),
  granularTimeResolution = false,
  cookie = process.env.DEFAULT_COOKIE_URI,
  proxyUri = process.env.PROXY_URI,
}) => {
  try {

    const result = await axios({
      url: "https://trends.google.com/trends/api/explore",
      method: "GET",
      httpsAgent: new ProxyAgent(proxyUri),
      params: {
        hl: "en-US",
        req: JSON.stringify({
          comparisonItem: buildComparisonItem({
            keyword: keywords,
            hl: 'en-US',
            timezone,
            category,
            property,
            startTime,
            endTime,
            granularTimeResolution,
          }),
          category,
          property,
        }),
        tz: timezone,
      },
      headers: { cookie },
      timeout: 5000,
    });
    return JSON.parse(result.data.slice(4)).widgets;

  } catch (err) {
    if(process.env.NODE_ENV !== 'production') { 
      if(err.response.status === 429 && 
        err.response.headers && err.response.headers['set-cookie']) {
        console.log('Please save this cookie value for future requests:');
        const cookieVal = err.response.headers['set-cookie'][0].split(';')[0];
        console.log(cookieVal);
        
      }
    }
    throw err;
  }
};

module.exports = getInterestOverTimeKey;
