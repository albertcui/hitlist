var express = require('express'),
    Sequelize = require('sequelize'),
    passport = require('passport'),
    u = require('./utility'),
    config = require('./config'),
    SteamStrategy = require('passport-steam').Strategy;
    
var app = express();

var host = config.ROOT_URL,
    apiKey = config.STEAM_API_KEY;

passport.serializeUser(function(user, done) {
    done(null, user.account_id);
});

passport.deserializeUser(function(id, done) {
    db.players.findAndModify({
        account_id: id
    }, {
        $set: {
            last_visited: new Date()
        }
    }, function(err, user) {
        done(err, user);
    });
});

passport.use(new SteamStrategy({
    returnURL: host + '/return',
    realm: host,
    apiKey: apiKey
}, function initializeUser(identifier, profile, done) {
    var steam32 = Number(u.convert64to32(identifier.substr(identifier.lastIndexOf("/") + 1)));
    var insert = profile._json;
    insert.account_id = steam32;
    insert.join_date = new Date();
    insert.last_summaries_update = new Date();
    done(null, insert);
}));

app.route('/login').get(passport.authenticate('steam', {
    failureRedirect: '/'
}));

app.route('/return').get(passport.authenticate('steam', {
    failureRedirect: '/'
}), function(req, res, next) {
    db.players.findOne({
        account_id: req.user.account_id
    }, function(err, doc) {
        if (err) {
            return next(err);
        }
        if (doc) {
            //don't update join date if we have this in db already
            delete req.user["join_date"];
        }
        db.players.update({
            account_id: req.user.account_id
        }, {
            $set: req.user
        }, {
            upsert: true
        }, function(err) {
            if (err) {
                return next(err);
            }
            queueReq("fullhistory", req.user, function(err, job) {
                if (err) {
                    return next(err);
                }
                res.redirect('/players/' + req.user.account_id);
            });
        });
    });
});

app.route('/logout').get(function(req, res) {
    req.logout();
    req.session.destroy(function() {
        res.redirect('/');
    });
});