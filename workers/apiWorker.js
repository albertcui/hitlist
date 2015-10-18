var Promise = require("bluebird");
var getUserGamesQueue = require("../queues").getUserGamesQueue;
var db = require("../db");
var api = require("../utility/api");

getUserGamesQueue.clean(10000, "waiting");
getUserGamesQueue.clean(10000, "failed");
getUserGamesQueue.clean(10000, "active");
getUserGamesQueue.clean(10000, "delayed");
getUserGamesQueue.clean(10000);

getUserGamesQueue.on('cleaned', function (job, type) {
  console.log('Cleaned %s %s jobs', job.length, type);
});

getUserGamesQueue.process(function(job, done) {
    console.log("processing");
    
    var getOwnedGamesArgs = {
        steamid: job.data.steamid,
        include_appinfo: true,
        include_played_free_games: true,
        appids_filter: false
    }
    
    api("getOwnedGames", getOwnedGamesArgs, function(err, data) {
        if (err) return done(err);
        
        db.models.User.findById(job.data.userID)
        .then(function(user) {
            if (user) {
                Promise.map(data.games, function(elem) {
                    var timePlayed = elem.playtime_forever;
                    return db.models.Game.findOrCreate({
                        where: {
                            appid: elem.appid
                        },
                        defaults: elem
                    })
                    .spread(function(game, created) {
                        return user.addGame(game, {timePlayed: timePlayed});
                    })
                });
            } else {
                throw "Couldn't find user";
            }
        })
        .then(function() {
            done();
        })
        .catch(function(err) {
            done(err);
        })
    })
});