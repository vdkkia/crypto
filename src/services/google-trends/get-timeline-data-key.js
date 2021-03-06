const axios = require("axios");
const ProxyAgent = require("proxy-agent");
const buildComparisonItem = require("./utils/build-comparison-item");

const TIMEOUT = process.env.AXIOS_TIMEOUT;
axios.defaults.timeout = TIMEOUT;

const getTimelineDataKey = async ({
  keywords,
  timezone = new Date().getTimezoneOffset(),
  category = 0,
  property = "",
  startTime = new Date("2004-01-01"),
  endTime = new Date(),
  granularTimeResolution = false,
  cookie = process.env.DEFAULT_COOKIE_URI,
  proxyUri = process.env.PROXY_URI,
  log = true,
}) => {
  try {
    const cancelTokenSource = axios.CancelToken.source();
    setTimeout(() => {
      cancelTokenSource.cancel();
    }, TIMEOUT);
    const result = await axios({
      url: "https://trends.google.com/trends/api/explore",
      method: "GET",
      httpsAgent: new ProxyAgent(proxyUri),
      params: {
        hl: "en-US",
        req: JSON.stringify({
          comparisonItem: buildComparisonItem({
            keyword: keywords,
            hl: "en-US",
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
      headers: cookie ? { cookie } : undefined,
      cancelToken: cancelTokenSource.token,
    });
    return {
      widgets: JSON.parse(result.data.slice(4)).widgets,
      obj: {
        category,
        property,
        timezone,
        hl: "en-US",
      },
      proxyUri,
    };
  } catch (err) {
    if (process.env.NODE_ENV !== "production" && log) {
      if (err?.response?.status === 429 && err?.response?.headers && err?.response?.headers["set-cookie"]) {
        console.log("Please save this cookie value for future requests:");
        const cookieVal = err.response.headers["set-cookie"][0].split(";")[0];
        console.log(cookieVal);
      }
    }
    throw err;
  }
};

module.exports = getTimelineDataKey;
