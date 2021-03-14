const { findBatchInfo } = require("../batches");
const { saveKeywordHistory } = require("../batches/keywords-history");
const logger = require("../logger");
const saveRecord = require("../records/save-record");
const normalizeTimelines = require("./normalize-timelines");

const SEPERATOR = "___SEP___";

const normalizeIncomingData = async (inputData) => {
  try {
    const [batchLabel, timelineDataStr] = inputData.split(SEPERATOR);
    const [batchInfo, batchIndex] = await findBatchInfo(batchLabel);

    const {
      default: { timelineData, averages },
    } = JSON.parse(timelineDataStr);

    const { newRecords, newHistoryMaps } = normalizeTimelines({
      batchInfo,
      timelineData,
      averages,
      batchIndex,
    });

    newRecords.forEach((record) =>
      saveRecord(record).catch((err) => logger.error(err.message))
    );
    newHistoryMaps.forEach((historyMap, index) =>
      saveKeywordHistory(batchInfo[index].term, historyMap).catch((err) =>
        logger.error(err.message)
      )
    );
  } catch (err) {
    logger.error(err.message);
  }
};

module.exports = normalizeIncomingData;
