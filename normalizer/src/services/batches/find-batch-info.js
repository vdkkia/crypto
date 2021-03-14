const loadBatchesInfo = require("./load-batches-info");
const { loadKeywordsHistory } = require("./keywords-history");

const findBatchInfo = async (batchLabel) => {
  const batchesInfo = await loadBatchesInfo();
  const batchIndex = Number(batchLabel.substring(1));
  const keywords = batchesInfo.batches[batchIndex];
  const withHistories = await loadKeywordsHistory(keywords);

  return [withHistories, batchIndex];
};

module.exports = findBatchInfo;
