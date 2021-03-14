const restify = require("restify");
const routes = require("./src/routes");
const redis = require("./src/adapters/redis");
const logger = require("./src/services/logger");

const server = restify.createServer({ name: "data normalizer server" });
routes(server);

(async () => {
  try {
    await redis.init();
    server.listen(3000, (err) => {
      if (err) {
        logger.error(
          `error happened when trying to run server ${server.name}:`
        );
        logger.error(err.message);
      }
      logger.info(`${server.name} listening at ${server.url}`);
    });
  } catch (err) {
    logger.error("error happened");
    logger.error(err.message);
  }
})();
