const logger = require('./../logger');
const findScaleFactor = require("./utils/find-scale-factor");

const normalizeTimelines = ({
  batchInfo,
  timelineData,
  averages,
  batchIndex,
}) => {
  const newHistoryMaps = [];
  const newRecords = [];
  const scaleFactors = batchInfo.map(({ history }, indexInBatch) =>
    findScaleFactor({ timelineData, history, indexInBatch })
  );
  // logger.info(`found scale factors: ${scaleFactors}`);
  batchInfo.forEach(({ term, category, history }, iInBatch) => {
    const batchNewHistory = {};
    const scaleFactor = scaleFactors[iInBatch];
    timelineData.forEach((dataPoint) => {
      const keywordDataPoint = {
        time: Number(dataPoint.time),
        formattedTime: dataPoint.formattedTime,
        formattedAxisTime: dataPoint.formattedAxisTime,
        valuePlain: dataPoint.value[iInBatch],
        value: parseFloat(dataPoint.value[iInBatch]) * scaleFactor,
        hasData: dataPoint.hasData[iInBatch],
        formattedValue: dataPoint.formattedValue[iInBatch],
        keyword: term,
        category,
        batchIndex,
      };
      batchNewHistory[dataPoint.formattedTime] = keywordDataPoint;
      if (!(dataPoint.formattedTime in history)) {
        newRecords.push(keywordDataPoint);
      }
    });
    newHistoryMaps.push(batchNewHistory);
  });

  return { newRecords, newHistoryMaps };
};

module.exports = normalizeTimelines;
