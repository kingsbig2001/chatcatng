'use strict';
const express = require('express');
const app = express();
const passport = require('passport');
const chatCat = require('./app');

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'))
app.set('view engine', 'ejs');

app.use(chatCat.session);
app.use(passport.initialize());
app.use(passport.session());
app.use(require('morgan')('combined', {
    stream: {
        write: message => {
            // Write to Logs
            chatCat.logger.log('info', message);
        }
    }
}))

app.use('/', chatCat.router);


chatCat.ioServer(app).listen(app.get('port'), ()=> {
    console.log('ChatCat App Started at Port:', app.get('port'))
})