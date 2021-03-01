const ProxyAgent = require("proxy-agent");
const hosts = require("./hosts");
let proxies = [];
let pool = [];

const proxyPool = {
  init: (size) => {
    proxies = hosts.map((x, i) => ({
      host: x,
      number: i + 1,
      retry: 0,
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
  replace: (number) => {
    const failedProxy = proxies.find((p) => p.number == pool[number].number);
    if (failedProxy.retry >= 20) {
      failedProxy.retry = 0;
      failedProxy.status = "banned";
    } else {
      failedProxy.retry++;
      failedProxy.status = "ready";
      // console.log("retry", failedProxy.retry, number);
    }
    const item = proxies.find((p) => p.status == "ready");
    if (!item) return "error";
    pool[number] = { proxy: new ProxyAgent(item.host), number: item.number };
    item.status = "active";
    item.updateTime = new Date();
    return pool[number].proxy;
  },
  activate: () => {
    console.log("PROXY POOL REFRESH....")
    proxies.forEach((proxy) => {
      if (proxy.status == "banned" && new Date() - proxy.updateTime > 3 * 3600 * 1000) {
        proxy.status = "ready";
        proxy.updateTime = new Date();
      }
    });
  },
};

// (async () => {
//   proxyPool.init(1);
//   const agent = new ProxyAgent("http://pcvpttjl-dest:w0kgh6nois6f@45.130.255.183:7205/")// proxyPool.acquire(0);

//   //   const proxyUri = "http://wupziwtp-dest:c2kw3rgv3znp@209.127.191.180:9279"
//   //   const agent = new ProxyAgent(proxyUri);
//   const trendController = require("../controllers/trendController");
//   const res = await trendController.interestOverTime("NSBT coin,Phantasma,soul coin,Umbrella Network,umb coin", "30m", null);
//   console.log(res);

//   // for (let i = 0; i < 200; i++) {
//   //   t(i);
//   // }
// })();

module.exports = proxyPool;
