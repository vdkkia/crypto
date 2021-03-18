const logger = require("./../logger");
const { db, pgp } = require("./../../adapters/postgres");

const recordColumns = new pgp.helpers.ColumnSet(
  [
    "interest_values",
    "ref_values",
    "report_time",
    "time",
    "last_value",
    "is_last_value_partial",
    "last_fixed_value",
    "average",
    "ref_average",
    "keyword",
    "reference",
    "scale_factor",
    "jump_factor",
    "three_day_average",
  ],
  { table: "dailies" }
);

const saveDailyTrendRecord = (record) => {
  try {
    const values = [record];
    const query =
      pgp.helpers.insert(values, recordColumns) + "ON CONFLICT DO NOTHING";
    return db.none(query);
  } catch (err) {
    logger.error(
      `error in saving daily trend record for ${record.keyword} to db.`
    );
    logger.error(err.message);
  }
};

module.exports = saveDailyTrendRecord;
