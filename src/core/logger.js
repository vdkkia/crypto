const winston = require("winston");
const timezoned = () => {
  return new Date().toLocaleString("en-US", {
    timeZone: "Europe/Brussels",
  });
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV == "dev" ? "debug" : "error",
      silent: false,
      localTime: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: timezoned,
        }),
        winston.format.printf((info) => `${info.timestamp} ${info.level} ${info.message}`)
      ),
    }),
  ],
});

module.exports = logger;
