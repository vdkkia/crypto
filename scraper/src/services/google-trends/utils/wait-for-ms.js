const waitForMs = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });

module.exports = waitForMs;
