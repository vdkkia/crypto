const Redis = require("ioredis");
let logger;
let redisClient;

const redis = {
  init: (_logger) => {
    logger = _logger;
    return new Promise((resolve, reject) => {
      redisClient = new Redis(process.env.REDIS_URI)
        .on("connect", () => {
          logger.info("Redis connection successful");
          resolve();
        })
        .on("error", (err) => {
          logger.error(err);
          reject();
        });
    });
  },
  client: () => redisClient,
  set: (key, value, expire) => {
    redisClient.set(key, JSON.stringify(value), "EX", expire, (e) => {
      if (e) logger.error(e);
    });
  },
  get: async (key) => {
    try {
      return JSON.parse(await redisClient.get(key));
    } catch (e) {
      logger.error(`Redis error: ${e}`);
    }
  },
  del: async (pattern) => {
    const pipeline = redisClient.pipeline();
    const keys = await redisClient.keys(pattern);
    keys.forEach((key) => {
      pipeline.del(key);
    });
    await pipeline.exec();
  },
  reset: async () => {
    const pipeline = redisClient.pipeline();
    const keys = await redisClient.keys("*");
    keys.forEach((key) => {
      pipeline.del(key);
    });
    await pipeline.exec();
  },
  expire: async () => {},
  getAll: async () => {
    let cookieSet = [];
    for (const proxyUri of await redisClient.keys("*")) {
      const cookie = await redis.get(proxyUri);
      cookieSet.push({
        proxyUri,
        cookie,
      });
    }
    return cookieSet;
  },
};

module.exports = redis;
