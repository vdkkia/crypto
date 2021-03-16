const { findBatchInfo } = require("../batches");
const { saveKeywordHistory } = require("../batches/keywords-history");
const logger = require("../logger");
const saveRecordsBatch = require("../records/save-records-batch");
const normalizeTimelines = require("./normalize-timelines");

const normalizeIncomingData = async ({
  batchIndex,
  timelineData,
  averages,
}) => {
  try {
    // logger.info("normalizing");
    const batchInfo = await findBatchInfo(batchIndex);

    // const {
    //   default: { timelineData, averages },
    // } = JSON.parse(timelineDataStr);

    const { newRecords, newHistoryMaps } = normalizeTimelines({
      batchInfo,
      timelineData,
      averages,
      batchIndex,
    });

    logger.info(`inserting ${newRecords.length} into the db`);

    // newRecords.forEach((record) =>
    //   saveRecord(record).catch((err) => logger.error(err.message))
    // );
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
  } catch (err) {
    logger.error("error in normalizeIncomingData");
    logger.error(err.message);
  }
};

module.exports = normalizeIncomingData;
