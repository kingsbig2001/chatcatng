'use strict';
const passport = require('passport');
const config = require('../config');
const logger = require('../logger');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const helper = require('../helpers');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  });

  passport.deserializeUser((id, done) => {
    // Find the user by id
    helper.findById(id)
      .then(user => done(null, user))
      .catch(error => logger.log('error', 'Error while deserialising the user: ' + error))
  })

  let authProcessor = (accessToken, refreshToken, profile, done) => {
    //Find a user in the local db using profile.id
    //If the user is found, return the user data using the done()
    //if the user is not found, create one in the local db and return
    helper.findOne(profile.id)
        .then(result => {
          if(result) {
            done(null, result);
          }else{
            // Create a new user and return
            helper.createNewUser(profile)
            .then(newChatUser => done(null, newChatUser))
            .catch(error => logger.log('error', 'Error while creating new user: ' + error))
          }
        })
  };

  passport.use(new FacebookStrategy(config.fb, authProcessor));
  passport.use(new TwitterStrategy(config.twitter, authProcessor));
  passport.use(new GoogleStrategy(config.google, authProcessor));
};
 