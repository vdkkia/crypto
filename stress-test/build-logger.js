const winston = require("winston");

const buildLogger = (fileNameTimestamp) =>
  winston.createLogger({
    level: "info",
    format: winston.format.simple(),
    transports: [
      new winston.transports.File({
        filename: `./stress-test/logs/${fileNameTimestamp}-errors.log`,
        level: "error",
      }),
      new winston.transports.File({
        filename: `./stress-test/logs/${fileNameTimestamp}-all.log`,
      }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.timestamp({
            format: "YYYYMMDD-HHmmss",
          }),
          winston.format.printf(
            ({ level, message, timestamp }) =>
              `${timestamp} ${level}: ${message}`
          )
        ),
      }),
    ],
  });

module.exports = buildLogger;
