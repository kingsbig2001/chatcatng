'use strict';

if(process.env.NODE_ENV === 'production'){
    // Offer production stage environment variables
    // process.env.REDIS_URL = "redis://h:p4b01a1aa84ad5e6fe8b135d64d42ecf06dd28025e596813068617a7aa28f3849@ec2-35-173-24-245.compute-1.amazonaws.com:13649";
    
    let redisURI = require('url').parse(process.env.REDIS_URL);
    let redisPassword = redisURI.auth.split(':')[1];
    module.exports = {
        host : process.env.host || "",
        dbURI : process.env.dbURI,
        sessionSecret: process.env.sessionSecret,
        fb: {
            clientID : process.env.fbClientID,
            clientSecret : process.env.fbClientSecret,
            callbackURL : "https://" + process.env.host + "/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos'],
            enableProof: true
        },
        twitter: {
            consumerKey : process.env.twConsumerKey,
            consumerSecret : process.env.twConsumerSecret,
            callbackURL : "https://" + process.env.host + "/auth/twitter/callback",
            profileFields: ['id', 'displayName', 'photos']
        },
        redis: {
            host: redisURI.hostname,
            port: redisURI.port,
            password: redisPassword
        }
    }
}else{
    //Offer dev stage development variables
    module.exports = require('./config.json')
}