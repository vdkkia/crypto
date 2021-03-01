module.exports = (second) => {
  const ms = second || Math.floor(Math.random() * 5) + 2;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms * 1000);
  });
};