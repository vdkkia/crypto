const prepareBatches = (keywords, batchSize) => {
  const batches = [];
  let i = 0;
  while (i < keywords.length) {
    const end = Math.min(i + batchSize, keywords.length - 1);
    batches.push(keywords.slice(i, end));
    i += batchSize;
  }
  return batches;
};

module.exports = prepareBatches;
