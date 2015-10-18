var express = require('express');
var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;

var app = express.Router();

var db = require('../db');
var config = require('../config');
var apiKey = config.STEAM_API_KEY;
var host = config.ROOT_URL;
var getUserGamesQueue = require("../queues").getUserGamesQueue;

passport.serializeUser(function(user, done) {
    done(null, user.steamid);
});

passport.deserializeUser(function(id, done) {
    db.models.User.findOne({
        where: {
            steamid: id
        }
    })
    .then(function(user) {
        if (!user) return done(null, null);
        user.HLLastVisited = new Date();
        user.save();
        done(null, user);
    })
    .catch(function(err) {
        done(err);
    });
});

passport.use(new SteamStrategy({
    returnURL: host + '/return',
    realm: host,
    apiKey: apiKey
}, function(identifier, profile, done) {
    
    if (!profile._json) {
        return done("No profile.", null);
    }
    
    var user = profile._json;
    user.timecreated = user.timecreated * 1000 || null;
    user.HLJoinDate = new Date();
    console.log(user);
    done(null, user);
}));

app.route('/login').get(passport.authenticate('steam', {
    failureRedirect: '/'
}));

app.route('/return').get(passport.authenticate('steam', {
    failureRedirect: '/'
}), function(req, res, next) {
    db.models.User.findOrCreate({
        where: {
            steamid: req.user.steamid
        },
        defaults: req.user
    })
    .spread(function(user, created) {
        user.HLLastLoggedIn = new Date();
        user.save();
        getUserGamesQueue.add({
            steamid: user.steamid,
            userID: user.id
        })

        res.redirect("/");
    })
    .catch(function(err) {
        next(err);
    })
});

app.route('/logout').get(function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = {
    routes: app,
    passport: passport
};