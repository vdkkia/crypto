const findRefScaleFactor = ({ trendData, refTrend }) => {
  const commonHours = Object.keys(trendData.timeMap).filter(
    (ts) =>
      ts in refTrend.timeMap &&
      trendData.timeMap[ts].value != 0 &&
      refTrend.timeMap[ts].value != 0
  );
  const scaleFactor =
    commonHours
      .map((ts) =>
        parseFloat(trendData.timeMap[ts].value / refTrend.timeMap[ts].value)
      )
      .reduce((tot, sf) => tot + sf, 0) / commonHours.length;

  return scaleFactor;
};

module.exports = findRefScaleFactor;
