const fs = require("fs");
const path = require("path");

const Bottleneck = require("bottleneck");
const { getNewCookie } = require("../src/services/google-trends");
const proxyUris = require("./../src/core/jobs/hosts");

const DELAY_BETWEEN_CALLS_MS = 100;
const MAX_CONCURRENCY = 50;

const FILE_NAME = "cookie-stock.json";

const limiter = new Bottleneck({
  minTime: DELAY_BETWEEN_CALLS_MS,
  maxConcurrent: MAX_CONCURRENCY,
});

const throttledGetNewCookie = limiter.wrap(getNewCookie);

const cookieStockFilePath = path.join(__dirname, FILE_NAME);

const loadCookieStock = async (forceWrite = false) => {
  if (fileExists(cookieStockFilePath) && !forceWrite) {
    return JSON.parse(fs.readFileSync(cookieStockFilePath));
  }

  const cookies = await Promise.all(
    proxyUris.map((proxyUri) => throttledGetNewCookie({ proxyUri }))
  );
  const cookieMap = cookies.reduce(
    (acc, cookie, index) => ({
      ...acc,
      [proxyUris[index]]: { proxyUri: proxyUris[index], cookie },
    }),
    {}
  );

  fs.writeFileSync(cookieStockFilePath, JSON.stringify(cookieMap));
  return cookieMap;
};

module.exports = loadCookieStock;

function fileExists(filePath) {
  try {
    fs.statSync(filePath);
    return true;
  } catch (err) {
    return false;
  }
}
