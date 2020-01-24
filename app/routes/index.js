'use strict';
const helper = require('../helpers');
const passport = require('passport');
const config = require('../config');

module.exports = () => {
  let routes = {
    get: {
      '/': (req, res, next) => {
        res.render('login');
      },
      '/rooms': [
        helper.isAuthenticated,
        (req, res, next) => {
          res.render('rooms', {
            user: req.user,
            host: config.host,
          });
        },
      ],

      '/chat/:id': [
        helper.isAuthenticated,
        (req, res, next) => {
          let getRoom = helper.findRoomById(req.app.locals.chatroom, req.params.id);
          if (!getRoom) {
            return next();
          } else {
            res.render('chatroom', {
              user: req.user,
              host: config.host,
              room: getRoom.room,
              roomID: getRoom.roomID,
            });
          }
        },
      ],
      '/auth/facebook': passport.authenticate('facebook'),
      '/auth/facebook/callback': passport.authenticate('facebook', {
        successRedirect: '/rooms',
        failureRedirect: '/',
      }),
      '/auth/twitter': passport.authenticate('twitter'),
      '/auth/twitter/callback': passport.authenticate('twitter'),
      '/logout': (req, res, next) => {
        req.logout();
        res.redirect('/');
      },
    },

    post: {},
    NA: (req, res, next) => {
      res.status(400).sendFile(process.cwd() + '/views/404.htm');
    },
  };

  return helper.route(routes);
};