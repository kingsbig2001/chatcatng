'use strict';
const config = require('./config');
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');

// Social authentication logic
require('./auth')();

// Create an IO Server
let ioServer = app => {
    app.locals.chatroom = [];
    const server = require('http').Server(app);
    const io = require('socket.io')(server);
    io.set('transports', ['websocket']);

    let pubClient = redis(config.redis.port, config.redis.host, {
        auth_pass: config.redis.password
    });
    let subClient = redis(config.redis.port, config.redis.host, {
        return_buffers: true,
        auth_pass: config.redis.password
    });
    io.adapter(adapter({
        pubClient,
        subClient
    }))
    require('./socket')(io, app);
    io.use((socket, next) => {
        require('./session')(socket.request, {}, next);
    });
    return server;
}

module.exports = {
    router : require('./routes')(),
    session : require('./session'),
    ioServer,
    logger: require('./logger')
}
