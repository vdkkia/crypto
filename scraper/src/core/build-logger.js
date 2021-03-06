const winston = require("winston");
const moment = require("moment");
const buildLogger = (fileNameTimestamp) =>
  winston.createLogger({
    level: "info",
    format: winston.format.simple(),
    transports: [
      new winston.transports.File({
        filename: `./src/logs/${fileNameTimestamp}-errors.log`,
        level: "error",
      }),
      new winston.transports.File({
        filename: `./src/logs/${fileNameTimestamp}-all.log`,
      }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.timestamp({
            format: "YYYYMMDD-HHmmss",
          }),
          winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)
        ),
      }),
    ],
  });

const logger = buildLogger(moment().format("YYMMDD-HHmmss"));
module.exports = logger;
