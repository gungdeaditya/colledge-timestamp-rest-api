var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");

router.post('/signup', function(req, res) {
  if (!req.body.email || !req.body.password || !req.body.name || !req.body.phoneNumber) {
    res.json({status: false, message: 'Field cannot be blank!'});
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password,
      name : req.body.name,
      phoneNumber : req.body.phoneNumber
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.status(401).json({status: false, message: 'Email already exists.'});
      }
      res.status(200).json({status: true, message: 'Successful created new user.'});
    });
  }
});

router.post('/signin', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.status(401).send({status: false, message: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          res.status(200).json({status: true, message: 'User exist', data : user});
        } else {
          res.status(401).json({status: false, message: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

router.post('/signinWithToken', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({status: false, message: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user, config.secret);
          // return the information including token as JSON
          res.json({status: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({status: false, mesasge: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;