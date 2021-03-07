const detector = async (data, keywords, logger) => {
  try {
    if (data && data.length > 1) {
      const lastData = data.pop();
      const restData = data;
      lastData.value.forEach((val, i) => {
        // Calculate average of item i in restData
        const avg = restData.map((x) => x.value[i]).reduce((t, j) => t + j) / restData.length;
        logger.warn(`Coin: ${keywords[i]} Average is ${avg}, value is: ${val}`);
        if (avg > 0 && val > avg * 5) {
          logger.warn("=======================================");
          logger.info(`Jump detected!!!, coin: ${keywords[i]}`);
          logger.warn("=======================================");
        }
      });
    } else {
      logger.warn("Data is incomplete.");
    }
  } catch (err) {
    logger.error("Error" + err);
  }
};

module.exports = detector;
