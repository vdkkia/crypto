const logger = require("../logger");
const ProxyAgent = require("proxy-agent");
const hosts = require("./hosts");
let proxies = [];
let pool = [];

const proxyPool = {
  init: (size) => {
    proxies = hosts.map((x, i) => ({
      host: x,
      number: i + 1,
      status: "ready",
      updateTime: new Date(),
    }));

    for (let i = 0; i < size; i++) {
      const item = proxies.find((p) => p.status == "ready");
      const proxy = new ProxyAgent(item.host);
      item.status = "active";
      item.updateTime = new Date();
      pool.push({ proxy, number: item.number });
    }
  },
  acquire: (number) => {
    return pool[number].proxy;
  },
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
};

module.exports = proxyPool;
