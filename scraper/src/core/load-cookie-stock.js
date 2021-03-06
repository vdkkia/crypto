const redis = require("../database/redis");
const Bottleneck = require("bottleneck");
const { getNewCookie } = require("../services/google-trends");
const proxyUris = require("../database/hosts");

const DELAY_BETWEEN_CALLS_MS = 100;
const MAX_CONCURRENCY = 50;

const limiter = new Bottleneck({
  minTime: DELAY_BETWEEN_CALLS_MS,
  maxConcurrent: MAX_CONCURRENCY,
});

const throttledGetNewCookie = limiter.wrap(getNewCookie);

const loadCookieStock = async (forceRefresh = false) => {
  const redisCookies = await redis.getAll();
  if (redisCookies.length == 0 || forceRefresh) {
    const cookies = await Promise.all(proxyUris.map((proxyUri) => throttledGetNewCookie({ proxyUri })));
    cookies.forEach((cookie, i) => {
      redis.set(proxyUris[i], cookie, 3600 * 4);
    });
    return cookies.map((cookie, i) => ({ proxyUri: proxyUris[i], cookie: cookie }));
  } else {
    return redisCookies;
  }
};

module.exports = loadCookieStock;
