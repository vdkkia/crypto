const Redis = require("ioredis");

const logger = require("./../services/logger");

let client;

const init = () =>
  new Promise((resolve, reject) => {
    client = new Redis(process.env.REDIS_URI)
      .on("connect", () => {
        logger.info("Redis connection established");
        resolve();
      })
      .on("error", (err) => {
        logger.error(`Error connection to redis: ${err.message}`);
        reject(err);
      });
  });

module.exports = { init, client: () => client };
