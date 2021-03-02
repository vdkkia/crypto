const logger = require("../logger");
const ProxyAgent = require("proxy-agent");
const { SocksProxyAgent } = require("socks-proxy-agent");

const hosts = require("./hosts");
// const rotatingProxy = "http://golbaghi.zaeem.gmail.com:abm9z4@69.30.242.214:2000";
// const socksRotatingProxy = "socks://golbaghi.zaeem.gmail.com:abm9z4@69.30.242.214:3000";
// const HttpPRX = new ProxyAgent(rotatingProxy);
// const SocksPRX = new SocksProxyAgent(socksRotatingProxy);
// const PROXY = SocksPRX
// const host = "http://golbaghi.zaeem.gmail.com:abm9z4@69.30.242.214:%PORT%";
let proxies = [];
let pool = [];

const proxyPool = {
  init: (size) => {
    // for (let i = 1; i < size + 1; i++) {
    hosts.map((x, i) => {
      proxies.push({
        host: x, // host.replace("%PORT%", 20000 + i),
        number: i + 1,
        retry: 0,
        status: "ready",
        updateTime: new Date(),
      });
    });

    // }
    for (let i = 0; i < size; i++) {
      const item = proxies[i];
      const proxy = new ProxyAgent(item.host); //PROXY; // new ProxyAgent(item.host);
      item.status = "active";
      item.updateTime = new Date();
      pool.push({ proxy, number: item.number });
    }
  },
  acquire: (number) => pool[number].proxy,
  replace: (number) => {
    const failedProxy = proxies.find((p) => p.number == pool[number].number);
    if (failedProxy.retry >= 20) {
      failedProxy.retry = 0;
      failedProxy.status = "banned";
    } else {
      failedProxy.retry++;
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
      if (proxy.status == "banned" && new Date() - proxy.updateTime > 1800 * 1000) {
        //30 mins
        proxy.status = "ready";
        proxy.updateTime = new Date();
      }
    });
  },
  // acquireRotatingProxy: () => new ProxyAgent(rotatingProxyhost),
};

// (async () => {
//   const axios = require("axios");
//   // const trendController = require("../controllers/trendController");
//   // const agent = new ProxyAgent(host.replace("%PORT%", 20001));
//   // const a = await trendController.interestOverTime("bitcoin,vechain", "30m", agent);

//   const { default: PQueue } = require("p-queue");
//   const queue = new PQueue({ concurrency: 100 });
//   // (async () => {

//   for (let i = 0; i < 100; i++) {
//     queue.add(async () => {
//       const agent = new ProxyAgent("http://golbaghi.zaeem.gmail.com:abm9z4@69.30.242.214:2000");
//       const b = await axios.get("http://httpbin.org/ip", {
//         httpAgent: agent,
//       });
//       const y = b.data;
//       console.log(i);
//     });
//   }
//   //   logger.info("Queue: a task was started.");
//   // })();
// })();

module.exports = proxyPool;
