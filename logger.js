const winston = require("winston");
const { format,transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint,json } = format;
const CATEGORY = "winston custom format";
require("winston-daily-rotate-file");

//DailyRotateFile func()
const fileRotateTransport = new transports.DailyRotateFile({
    filename: "logs/rotate-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "1d",
  });

const logger = winston.createLogger({
    level: 'info',
    format: combine(label({ label: CATEGORY }), json()),
    // foformat: combine(
    //     label({ label: CATEGORY }),
    //     timestamp({
    //       format: "MMM-DD-YYYY HH:mm:ss",
    //     }),
    //     prettyPrint()
    //   ),
    defaultMeta: { service: 'base-app' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      fileRotateTransport,
      new winston.transports.Console(),
    //   new winston.transports.File({ filename: 'error.log', level: 'error' }),
    //   new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

module.exports = logger;