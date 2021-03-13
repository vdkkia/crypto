const restify = require("restify");
const addPostgresConnector = require("./adapters/ksqldb/add-postgres-connector");
const createCointerestsStream = require("./adapters/ksqldb/queries/create-cointerests-stream");
const runKSQL = require("./adapters/ksqldb/run-ksql");
// const { ensureTopicsExist } = require("./services/events/processors");
const routes = require("./routes");
const { initCointerestsStream } = require("./services/streams");

const server = restify.createServer({
  name: "backoffice server",
});

routes(server);

server.listen(3000, (err) => {
  if (err) {
    console.log(`error happened when trying to run server ${server.name}:`);
    console.error(err);
  }
  console.log(`${server.name} listening at ${server.url}`);
});

(async () => {
  try {
    console.log("setting up...");
    await initCointerestsStream();
  } catch (err) {
    console.error(err);
  }
})();
