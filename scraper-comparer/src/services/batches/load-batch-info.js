const redis = require("./../../adapters/redis");
const createBatches = require("./create-batches");

const BATCHES_STOCK_REDIS_KEY = "KEYWORD_BATCHES";

let batchInfo;

const loadBatchInfo = async () => {
  if (batchInfo) return batchInfo;
  const batchInfoStr = await redis.client().get(BATCHES_STOCK_REDIS_KEY);
  if (batchInfoStr !== null) {
    batchInfo = JSON.parse(batchInfoStr);
    return batchInfo;
  }
  const newBatchInfo = await createBatches();
  batchInfo = newBatchInfo;
  return newBatchInfo;
};

module.exports = loadBatchInfo;
