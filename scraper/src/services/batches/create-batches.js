const keywords = require("./../../../data/keywords.json");
const redis = require("./../../adapters/redis");
const logger = require("./../logger");

const BATCHES_STOCK_REDIS_KEY = "KEYWORD_BATCHES";

const createBatches = async (batchSize = 5) => {
  logger.info("Creating batches");
  const cleanKeywords = keywords.map(({ term, category }) => ({
    term: term.trim(),
    category,
  }));
  const categoryMap = cleanKeywords.reduce(
    (acc, kw) => ({
      ...acc,
      [kw.term]: kw.category,
    }),
    {}
  );
  const batches = [];
  let i = 0;
  while (i < cleanKeywords.length) {
    const end = Math.min(i + batchSize, cleanKeywords.length);
    batches.push(cleanKeywords.slice(i, end));
    i += batchSize;
  }
  const batchInfo = { batches, categoryMap };
  await redis.client().set(BATCHES_STOCK_REDIS_KEY, JSON.stringify(batchInfo));
  logger.info(
    `${batches.length} batches created and saved to redis for further use.`
  );

  return batchInfo;
};

module.exports = createBatches;
