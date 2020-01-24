'use strict';
const express = require('express');
const app = express();
const passport = require('passport');
const chatCat = require('.');

//app.set('PORT', process.env.PORT || 3000);
const port = process.env.PORT || 6000;
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


// app.listen(PORT, '0.0.0.0', ()=> {
//     console.log('ChatCat App Started at Port:', PORT)
// })

app.listen(port, () => winston.info(`Application started on port👍 ${port}, ${process.cwd()}, ${__dirname}`));