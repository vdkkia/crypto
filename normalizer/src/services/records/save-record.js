const { runKSQL } = require("../../adapters/ksqldb");
const moment = require("moment");

const saveRecord = async (record) => {
  const recordTime = moment.unix(record.time).format("YYYYMMDDHHmm");
  const timestamp = moment.unix(record.time).format("yyyyMMDD HH:mm:ss");
  const reportKey = `${recordTime}-${record.keyword}`;
  const result = await runKSQL(`
INSERT INTO COINTERESTS (
  REPORT_KEY,
  INTEREST_PLAIN,
  INTEREST,
  KEYWORD,
  TIMESTAMP,
  REPORT_TIME,
  BATCH_NO,
  HAS_DATA,
  FORMATTED_AXIS_TIME,
  FORMATTED_TIME,
  FORMATTED_VALUE
) VALUES (
  '${reportKey}',
  ${record.valuePlain},
  ${record.value},
  '${record.keyword}',
  '${timestamp}',
  ${record.time},
  ${record.batchIndex},
  ${record.hasData},
  '${record.formattedAxisTime}',
  '${record.formattedTime}',
  '${record.formattedValue}'
);
  `);
  return result;
};

module.exports = saveRecord;
