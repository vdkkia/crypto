const loadBatchesInfo = require("./load-batches-info");
const { loadKeywordsHistory } = require("./keywords-history");

const findBatchInfo = async (batchIndex) => {
  const batchesInfo = await loadBatchesInfo();
  const keywords = batchesInfo.batches[batchIndex];
  const withHistories = await loadKeywordsHistory(keywords);

  return withHistories;
};

module.exports = findBatchInfo;
