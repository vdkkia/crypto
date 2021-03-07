const detector = async (data, logger) => {
  let mostRecent;
  try {
    if (data && data.length) {
      mostRecent = Number(data.slice(-1)[0].value[0]);
      logger.info(`mostRecent is ${mostRecent}`);
      const values = data.filter((x) => x.value).map((x) => x.value[0]);
      if (values.length) {
        const avg = values.reduce((t, i) => t + i) / values.length;
        logger.warn(`Average is ${avg}`);
        logger.warn(`mostRecent is ${mostRecent}`);
        if (mostRecent >= 2 * avg) {
          logger.info("=================");
          logger.info("Jump detected!!!");
          logger.info("=================");
        }
      }
    } else {
      logger.info("Data is incomplete.");
    }
  } catch (err) {
    logger.error("Error" + err);
  }
};

module.exports = detector;
