var express = require('express');
var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;

var app = express.Router();

var db = require('../db');
var config = require('../config');
var apiKey = config.STEAM_API_KEY;
var host = config.ROOT_URL;

passport.serializeUser(function(user, done) {
    done(null, user.steamID);
});

passport.deserializeUser(function(id, done) {
    db.models.User.findOne({
        where: {
            steamID: id
        }
    })
    .then(function(user) {
        done(null, user);
    })
    .catch(function(err) {
        done(err, null);
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
    
    var user = {
        steamID: profile._json.steamid,
        profileName: profile._json.personaname,
        profileURL: profile._json.profileurl,
        avatar: profile._json.avatar,
        avatarMedium: profile._json.avatarmedium,
        avatarFull: profile._json.avatarfull,
        steamUserSince: profile._json.timecreated * 1000,
        HLJoinDate: new Date()
    };

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
            steamID: req.user.steamID
        },
        defaults: req.user
    })
    .spread(function(user, created) {
        user.HLLastLoggedIn = new Date();
        user.save();
        
        res.redirect("/");
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