const findRelativeScale = (refTrend) => {
  const coinSum = refTrend.record.interest_values
    .slice(-73, -1)
    .reduce((a, b) => a + b, 0);
  const refSum = refTrend.record.ref_values
    .slice(-73, -1)
    .reduce((a, b) => a + b, 0);
  return refSum !== 0 ? coinSum / refSum : 0;
};

module.exports = findRelativeScale;
