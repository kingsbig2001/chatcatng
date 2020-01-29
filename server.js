'use strict';
const express = require('express');
const app = express();
const passport = require('passport');
const chatCat = require('./app');
const logger = require('./app/logger');

process.env.PORT = 3000;

app.set('port', process.env.PORT || 3200);
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(chatCat.session);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  require('morgan')('combined', {
    stream: {
      write: message => {
        // Write to Logs
        chatCat.logger.log('info', message);
      },
    },
  })
);

app.use('/', chatCat.router);
logger.info(process.env.PORT);

chatCat.ioServer(app).listen(app.get('port'), () => {
	logger.info(`ChatCAT Running on Port: ', ${app.get('port')}`);
});
