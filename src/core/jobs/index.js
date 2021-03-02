const trends = require("../../models/trend");
const groupedTrends = require("../../models/groupedTrend");
const trendController = require("../controllers/trendController");
const logger = require("../logger");
const coins = require("./coinRepo");
const proxyPool = require("./proxy");
const sleep = require("./sleep");
const { default: PQueue } = require("p-queue");
const queue = new PQueue({ concurrency: 1 });
const interval = "30m";

proxyPool.init(coins.length);


const groupRunner = async () => {
  await queue.add(async () => {
    logger.info("Queue: a task was started.");
    return await Promise.all(coins.map((x, i) => getTrend(x, i)));
  });
};

const dataFetcher = async (items, i) => {
  try {
    // Ensures that each group is using a specific proxy
    const proxy = proxyPool.acquire(i);
    const result = await trendController.interestOverTime(items, interval, proxy);
    if (Array.isArray(result)) {
      return result;
    } else {
      // const replaceResult = proxyPool.replace(i, result);
      // if (!replaceResult) {
      //   logger.error("Get trends data failed. All proxies are either in use or banned :(");
      //   return null;
      // }
      // logger.info("Proxy number " + i + " was replaced with a new one.");
      // await sleep(1);
      logger.info("Retry....");
      return dataFetcher(items, i);
    }
  } catch (err) {
    logger.error("dataFetcher Error: " + err);
  }
};

const getTrend = async (group, i) => {
  // Individual coins
  for (const [index, coin] of group.entries()) {
    const individualResult = await dataFetcher(coin, i);
    if (individualResult) {
      // await sleep();
      const data = individualResult.map((z) => ({
        time: z?.time,
        value: z?.value[0],
      }));
      try {
        await trends.findOneAndUpdate(
          { keyword: coin },
          { $push: { data: JSON.stringify(data) } },
          { upsert: true }
        );
        logger.info("Group'" + i + "' " + (index + 1) + "/" + group.length + " '" + coin.toUpperCase() + "'");
      } catch (e) {
        logger.error(
          "Group'" + i + "' " + (index + 1) + "/" + group.length + " '" + coin.toUpperCase() + "': " + e
        );
      }
    } else {
      logger.error("No data for '" + coin.toUpperCase() + "'");
    }
  }

  // Group of coins
  // await sleep();
  const groupResult = await dataFetcher(group, i);
  if (groupResult) {
    const data = groupResult.map((z) => ({
      time: z?.time,
      value: z?.value,
    }));
    try {
      await groupedTrends.findOneAndUpdate(
        { keyword: group.join("|") },
        { $push: { data: JSON.stringify(data) } },
        { upsert: true }
      );
      logger.info("group  < " + group.join(" | ") + " >");
    } catch (e) {
      logger.error("group  < " + group.join(" | ") + " >: " + e);
    }
  } else {
    logger.error("No data for < " + group.join(" | ") + " >");
  }
  logger.warn("================= < " + group.join(" | ") + " > =================");
};

module.exports = { groupRunner };
