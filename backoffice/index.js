const restify = require("restify");
const { ensureTopicsExist } = require("./services/events/processors");
const { initCointerestsStream } = require("./services/streams");
const routes = require("./routes");

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
    await ensureTopicsExist();
    await initCointerestsStream();
  } catch (err) {
    console.error(err);
  }
})();
