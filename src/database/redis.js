const Redis = require("ioredis");
const logger = require("../core/logger");
const redisClient = new Redis({
  port: process.env.redisPort,
  host: process.env.redisHost,
  password: process.env.redisPassword,
}).on("connect", () => {
  logger.info("Redis connection successful");
});

const set = (key, value, expire) => {
  redisClient.set(key, JSON.stringify(value), "EX", expire, (e) => {
    if (e) logger.error(e);
  });
};

const get = async (key) => {
  try {
    return JSON.parse(await redisClient.get(key));
  } catch (e) {
    logger.error(`Redis error: ${e}`);
  }
};

const del = async (pattern) => {
  const pipeline = redisClient.pipeline();
  const keys = await redisClient.keys(pattern);
  keys.forEach((key) => {
    pipeline.del(key);
  });
  await pipeline.exec();
};

const reset = async () => {
  const pipeline = redisClient.pipeline();
  const keys = await redisClient.keys("*");
  keys.forEach((key) => {
    pipeline.del(key);
  });
  await pipeline.exec();
};

const expire = async () => {};

module.exports = { redisClient, set, get, del, reset, expire };
