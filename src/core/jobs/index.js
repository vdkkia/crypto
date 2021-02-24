const trends = require("../../models/trend");
const trendController = require("../controllers/trendController");
const logger = require("../logger");
const getTrend = async () => {
  for (const x of keywords) {
    const result = await trendController.interestOverTime(x, "4h");
    await sleep(200);
    if (Array.isArray(result)) {
      const data = result.map((z) => ({
        time: z?.time,
        value: z?.value[0],
      }));
      //   console.log(result)
      try {
        await trends.findOneAndUpdate(
          { keyword: x },
          { $push: { data: JSON.stringify(data) } },
          { upsert: true }
        );
        logger.info("Trend data stored for keyword: '" + x + "'");
      } catch (e) {
        logger.error("Error storing trend data for keyword: '" + x + "': " + e);
      }
    }
  }
};

module.exports = { getTrend };

const sleep = (ms) => {
  new Promise((resolve) => {
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
