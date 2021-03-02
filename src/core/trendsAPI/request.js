"use strict";
const https = require("https");
const querystring = require("querystring");
const sleep = require("../jobs/sleep");

const axios = require("axios");

// cache of the cookie - avoid re-requesting on subsequent requests.
let cookieVal;
let cookieRefresh = new Date();

// simpler request method for avoiding double-promise confusion
const rereq = (options, done) => {
  axios
    .get("http://" + options.host + options.path, {
      httpsAgent: options.agent,
      headers: options.headers,
      // timeout: 50000,
    })
    .then((res) => {
      done(null, res);
    })
    .catch((err) => {
      done(err);
    });
};

const request = async ({ method, host, path, qs, agent }) => {
  await sleep(1);
  const options = {
    host,
    method,
    path: `${path}?${querystring.stringify(qs)}`,
  };
  if (agent) options.agent = agent;
  // will use cached cookieVal if set on 429 error
  if (new Date() - cookieRefresh < 1 * 60* 1000) {
    if (cookieVal) options.headers = { cookie: cookieVal };
  } else {
    cookieRefresh = new Date();
  }
  return new Promise((resolve, reject) => {
    axios
      .get("http://" + options.host + options.path, {
        httpsAgent: options.agent,
        headers: options.headers,
        // timeout: 50000,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch(async (err) => {
        if (err.response?.status === 429 && err.response.headers["set-cookie"]) {
          cookieVal = err.response.headers["set-cookie"][0].split(";")[0];
          options.headers = { cookie: cookieVal };
          await sleep(1);
          rereq(options, (e, response) => {
            if (e) return reject(e.message);
            resolve(response.data);
          });
        } else {
          console.log(err.message);
          reject(err.message);
        }
      });
  });
};

module.exports = request;
