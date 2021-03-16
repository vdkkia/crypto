const findScaleFactor = ({ timelineData, history, indexInBatch }) => {
  if (Object.keys(history).length === 0) return 1;
  const commonDataPoint = timelineData.filter(
    ({ formattedTime, value }) =>
      formattedTime in history &&
      value[indexInBatch] !== 0 &&
      history[formattedTime].value !== 0
  );

  if (commonDataPoint.length === 0) return 1.0;
  const votes = commonDataPoint.map(
    (cdp) =>
      history[cdp.formattedTime].value / parseFloat(cdp.value[indexInBatch])
  );
  return votes.reduce((tot, b) => tot + b, 0) / votes.length;
};

module.exports = findScaleFactor;
