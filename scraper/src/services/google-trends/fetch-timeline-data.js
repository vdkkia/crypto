const axios = require("axios");
const ProxyAgent = require("proxy-agent");

const TIMEOUT = process.env.AXIOS_TIMEOUT;
axios.defaults.timeout = TIMEOUT;

const fetchTimelineData = async ({ widgets, obj, proxyUri }, plain = false) => {
  const resultObj = widgets.find(
    ({ id = "" }) => id.indexOf("TIMESERIES") > -1
  );

  if (!resultObj)
    throw new Error("Available widgets does not contain interest api type");

  let req = resultObj.request;
  const { token } = resultObj;
  req.requestOptions.category = obj.category;
  req.requestOptions.property = obj.property;
  req = JSON.stringify(req);

  const cancelTokenSource = axios.CancelToken.source();
  setTimeout(() => {
    cancelTokenSource.cancel();
  }, TIMEOUT);

  const dataResponse = await axios({
    url: "https://trends.google.com/trends/api/widgetdata/multiline",
    method: "GET",
    httpsAgent: new ProxyAgent(proxyUri),
    params: {
      hl: obj.hl,
      req,
      token,
      tz: obj.timezone,
    },
    cancelToken: cancelTokenSource.token,
  });

  if (plain) return dataResponse.data.slice(5);

  const {
    default: { timelineData },
  } = JSON.parse(dataResponse.data.slice(5));

  return timelineData;
};

module.exports = fetchTimelineData;
