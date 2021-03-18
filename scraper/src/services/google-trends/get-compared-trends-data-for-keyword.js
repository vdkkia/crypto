const getTimelineDataKey = require("./get-timeline-data-key");
const logger = require("./../logger");
const fetchTimelineData = require("./fetch-timeline-data");

const ONE_DAY = 60 * 60 * 1000 * 24;
const SEVEN_DAYS = 60 * 1000 * (60 * 24 * 7 - 1);

const getComparedTrendsDataForKeyword = async ({
  keyword,
  timeSpan = "day",
  compareWith = "arweave",
  cookie = process.env.DEFAULT_COOKIE_URI,
}) => {
  const startTime =
    timeSpan === "day"
      ? new Date(Date.now() - ONE_DAY)
      : new Date(Date.now() - SEVEN_DAYS);
  const timelineDataKey = await getTimelineDataKey({
    keywords: [keyword, compareWith],
    startTime,
    cookie,
    granularTimeResolution: true,
  });
  const timelineDataStr = await fetchTimelineData(timelineDataKey, true);
  const {
    default: { timelineData, averages },
  } = JSON.parse(timelineDataStr);

  return { timelineData, averages };
};

module.exports = getComparedTrendsDataForKeyword;
