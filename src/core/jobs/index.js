// const _ = require("lodash");
const trends = require("../../models/trend");
const trendController = require("../controllers/trendController");
const logger = require("../logger");
let mainCounter = 0;
const getTrend = async () => {
  mainCounter++;
  // const groupedKeywords = _.chunk(keywords, 5);
  for (const coin of keywords) {
    console.log(coin);
    const result = await trendController.interestOverTime(coin, "3h");
    await sleep(1000);

    if (Array.isArray(result)) {
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
        // logger.info("Trend data stored for keyword: '" + coin + "'");
      } catch (e) {
        logger.error("Error storing trend data for keyword: '" + coin + "': " + e);
      }
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
