const logger = require("../logger");
const ProxyAgent = require("proxy-agent");
// const { SocksProxyAgent } = require("socks-proxy-agent");

// const hosts = require("./hosts");
const host = "http://golbaghi.zaeem.gmail.com:abm9z4@69.30.242.214:%PORT%";
let proxies = [];
let pool = [];

const proxyPool = {
  init: (size) => {
    for (let i = 1; i < 500; i++) {
      proxies.push({
        host: host.replace("%PORT%", 20000 + i),
        number: i,
        status: "ready",
        updateTime: new Date(),
      });
    }
    for (let i = 0; i < size; i++) {
      const item = proxies[i];
      const proxy = new ProxyAgent(item.host);
      item.status = "active";
      item.updateTime = new Date();
      pool.push({ proxy, number: item.number });
    }
  },
  acquire: (number) => pool[number].proxy,
  replace: (number, result) => {
    const failedProxy = proxies.find((p) => p.number == pool[number].number);
    if (result == "Banned") {
      failedProxy.status = "banned";
    } else {
      failedProxy.status = "ready";
    }
    const readyProxies = proxies.filter((x) => x.status == "ready");
    const item = readyProxies[Math.round(Math.random() * readyProxies.length)];
    if (!item) return false;
    pool[number] = { proxy: new ProxyAgent(item.host), number: item.number };
    item.status = "active";
    item.updateTime = new Date();
    return pool[number].proxy;
  },
  activate: () => {
    logger.info("PROXY POOL REFRESH....");
    proxies.forEach((proxy) => {
      if (proxy.status == "banned" && new Date() - proxy.updateTime > 2 * 3600 * 1000) {
        proxy.status = "ready";
        proxy.updateTime = new Date();
      }
    });
  },
  // acquireRotatingProxy: () => new ProxyAgent(rotatingProxyhost),
};

// (async () => {
//   const trendController = require("../controllers/trendController");
//   const agent = new ProxyAgent(host.replace("%PORT%", 20001));
//   const a = await trendController.interestOverTime("bitcoin,vechain", "30m", agent);
//   console.log(a);
// })();

module.exports = proxyPool;
