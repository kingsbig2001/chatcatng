'use strict';

const winston = require('winston');
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: 'debug',
      filename: './chatCatDebug.log',
      handleExceptions: true,
    }),
    new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
    })
  ],
  exitOnError: false,
});

module.exports = logger;
