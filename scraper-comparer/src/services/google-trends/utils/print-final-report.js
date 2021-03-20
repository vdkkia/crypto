const logger = require("./../../logger");

const printFinalReport = (results, reportTitle = "") => {
  logger.info("---------------------------");
  logger.info("---------------------------");
  logger.info("---------------------------");
  logger.info("-----------REPORT----------");
  logger.info("---------------------------");
  logger.info(reportTitle);
  logger.info(`Total requests: ${results.length}`);
  const validDataPoints = results.filter((result) => result >= 1);
  const jumps = validDataPoints.reduce((acc, d) => acc + d - 1, 0);
  const cancels = results.filter((result) => result === 0);
  const errors = results.filter((result) => result === -1);
  logger.info(`Valid data: ${validDataPoints.length}`);
  logger.info(`Errors: ${results.length - validDataPoints.length}`);
  logger.info(
    `Success rate: ${parsePercent(validDataPoints.length / results.length)}`
  );
  logger.info(`Error rate: ${parsePercent(errors.length / results.length)}`);
  logger.info(`Cancel rate: ${parsePercent(cancels.length / results.length)}`);
  logger.info(`Jumps: ${jumps}`);
};

module.exports = printFinalReport;

function parsePercent(number) {
  return `${parseFloat(100 * number).toFixed(2)} %`;
}
