// const _ = require("lodash");
const trends = require("../../models/trend");
const trendController = require("../controllers/trendController");
const logger = require("../logger");

const { SocksProxyAgent } = require("socks-proxy-agent");
const proxyAgent = new SocksProxyAgent("socks5h://127.0.0.1:9050");
let isProxyUsing = false;

let mainCounter = 0;

const getTrend = async () => {
  mainCounter++;
  let counter = 0;
  // const groupedKeywords = _.chunk(keywords, 5);
  for (const coin of keywords) {
    counter++;
    logger.info(counter + "/" + keywords.length + (isProxyUsing ? " proxy" : "") + "  <" + coin + ">");
    let result;
    try {
      result = await trendController.interestOverTime(coin, "30m", isProxyUsing ? proxyAgent : null);
      if (!Array.isArray(result)) {
        logger.info((isProxyUsing ? "proxy agent" : "main IP") + " is blocked, trying the other one...");
        isProxyUsing = !isProxyUsing;
        result = await trendController.interestOverTime(coin, "3h", isProxyUsing ? proxyAgent : null);
        if (!Array.isArray(result)) {
          logger.error("FUCK! Both the main IP and the proxy are blocked by FUCKING Google!");
          return;
        }
      }
    } catch (err) {
      logger.error("Error: " + err);
    }

    await sleep(1000);

    const data = result.map((z) => ({
      time: z?.time,
      value: z?.value[0],
    }));
    //   console.log(result)
    try {
      await trends.findOneAndUpdate(
        { keyword: coin },
        { $push: { data: JSON.stringify(data) } },
        { upsert: true }
      );
      logger.info("OK");
    } catch (e) {
      logger.error("Error '" + coin + "': " + e);
    }
  }
  logger.info("===============================================" + mainCounter + "'");
};

module.exports = { getTrend };

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const keywords = [
  "Bitcoin",
  "Ethereum",
  "Binance coin",
  "Polkadot",
  "Cardano",
  "Litecoin",
  "Chainlink",
  "Uniswap",
  "Aave",
  "EOS",
  "Dogecoin",
  "Monero",
  "TRON",
  "Tezos",
  "Vechain",
  "Solana",
  "Filecoin",
  "Sushiswap",
  "Ravencoin",
  "Yearn.finance",
  "UMA",
  "REN",
  "Thorchain",
  "Ontology",
  "OMG network",
  "QTUM",
  "Kusama",
  "Lisk",
  "Ocean protocol",
  "1inch",
  "Celo",
  "Kyber",
  "Decentraland",
  "Band protocol",
  "Nucypher",
  "Algorand",
  "Polkastarter",
  "Chiliz",
  "Serum",
  "Komodo",
  "Augur",
  "Numeraire",
  "Fetch.ai",
  "Redfox labs",
  "Litentry",
  "BAT",
  "Ripple",
];
