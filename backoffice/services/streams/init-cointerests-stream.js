const addPostgresConnector = require("../../adapters/ksqldb/add-postgres-connector");
const createCointerestsStream = require("../../adapters/ksqldb/queries/create-cointerests-stream");
const runKSQL = require("../../adapters/ksqldb/run-ksql");

const initCointerestsStream = async () => {
  console.log("initializing cointerests stream");
  const result = await runKSQL(createCointerestsStream);
  await addPostgresConnector();
  console.log("cointerests stream initialized");
};

module.exports = initCointerestsStream;
