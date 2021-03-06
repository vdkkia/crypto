const printFinalReport = (results, logger) => {
  logger.info("---------------------------");
  logger.info("---------------------------");
  logger.info("---------------------------");
  logger.info("-----------REPORT----------");
  logger.info(`Total requests: ${results.length}`);
  const validDataPoints = results.filter((result) => result);
  logger.info(`Valid data: ${validDataPoints.length}`);
  logger.info(`Errors: ${results.length - validDataPoints.length}`);
  logger.info(`Success rate: ${validDataPoints.length / results.length}`);
};

module.exports = printFinalReport;
