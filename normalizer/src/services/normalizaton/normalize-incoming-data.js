const { findBatchInfo } = require("../batches");
const { saveKeywordHistory } = require("../batches/keywords-history");
const logger = require("../logger");
const saveRecordsBatch = require("../records/save-records-batch");
const normalizeTimelines = require("./normalize-timelines");
const saveNormalizationSampleForChecking = require("./save-normalization-sample-for-checking");

const normalizeIncomingData = async ({
  batchIndex,
  timelineData,
  averages,
}) => {
  try {
    const batchInfo = await findBatchInfo(batchIndex);

    const { newRecords, newHistoryMaps } = normalizeTimelines({
      batchInfo,
      timelineData,
      averages,
      batchIndex,
    });

    logger.info(`inserting ${newRecords.length} into the db`);

    saveRecordsBatch(newRecords)
      .then(() =>
        logger.info(`Successfully insertes ${newRecords.length} to the db`)
      )
      .catch((err) => logger.error(`[BATCH INSERT ERROR:] ${err.message}`));
    newHistoryMaps.forEach((historyMap, index) =>
      saveKeywordHistory(batchInfo[index].term, historyMap).catch((err) =>
        logger.error(err.message)
      )
    );
    saveNormalizationSampleForChecking({
      batchIndex,
      batchInfo,
      timelineData,
      averages,
      newRecords,
      newHistoryMaps,
    });
  } catch (err) {
    logger.error("error in normalizeIncomingData");
    logger.error(err.message);
  }
};

module.exports = normalizeIncomingData;
