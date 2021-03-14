const redis = require("../../adapters/redis");

const BATCHES_STOCK_REDIS_KEY = "KEYWORD_BATCHES";

let batchesInfo;

const loadBatchesInfo = async () => {
  if (batchesInfo) return batchesInfo;
  const batchInfoStr = await redis.client().get(BATCHES_STOCK_REDIS_KEY);
  if (batchInfoStr !== null) {
    batchesInfo = JSON.parse(batchInfoStr);
  }

  return batchesInfo;
};

module.exports = loadBatchesInfo;
