const moment = require("moment");
const { db, pgp } = require("./../../adapters/postgres");

const cs = new pgp.helpers.ColumnSet(
  [
    "REPORT_KEY",
    "INTEREST_PLAIN",
    "INTEREST",
    "KEYWORD",
    "TIMESTAMP",
    "REPORT_TIME",
    "BATCH_NO",
    "HAS_DATA",
    "FORMATTED_AXIS_TIME",
    "FORMATTED_TIME",
    "FORMATTED_VALUE",
  ],
  { table: "cointerests" }
);

const saveRecordsBatch = (records) => {
  if (records.length === 0) return Promise.resolve();
  const values = records.map((record) => {
    const recordTime = moment.unix(record.time).format("YYYYMMDDHHmm");
    const timestamp = moment.unix(record.time).format("yyyyMMDD HH:mm:ss");
    const reportKey = `${recordTime}-${record.keyword}`;
    return {
      REPORT_KEY: reportKey,
      INTEREST_PLAIN: record.valuePlain,
      INTEREST: record.value,
      KEYWORD: record.keyword,
      TIMESTAMP: timestamp,
      REPORT_TIME: record.time,
      BATCH_NO: record.batchIndex,
      HAS_DATA: record.hasData,
      FORMATTED_AXIS_TIME: record.formattedAxisTime,
      FORMATTED_TIME: record.formattedTime,
      FORMATTED_VALUE: record.formattedValue,
    };
  });
  const query = pgp.helpers.insert(values, cs) + "ON CONFLICT DO NOTHING";
  return db.none(query);
};

module.exports = saveRecordsBatch;
