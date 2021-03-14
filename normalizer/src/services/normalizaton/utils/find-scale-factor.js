const findScaleFactor = ({ timelineData, history, indexInBatch }) => {
  if (Object.keys(history).length === 0) return 1;
  const commonDataPoint = timelineData.find(
    ({ formattedTime, value }) =>
      formattedTime in history &&
      value[indexInBatch] !== 0 &&
      history[formattedTime].value !== 0
  );

  if (!commonDataPoint) return 1;
  return (
    history[commonDataPoint.formattedTime].value / commonDataPoint.value[indexInBatch]
  );
};

module.exports = findScaleFactor;
