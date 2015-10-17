var apiQueue = require("../queues").apiQueue;
var db = require("../db");

var Steam = require("steam-webapi");
var Promise = require("bluebird");

Steam.key = require("../config").STEAM_API_KEY;

apiQueue.clean(10000, "waiting");
apiQueue.clean(10000, "failed");
apiQueue.clean(10000, "active");
apiQueue.clean(10000, "delayed");
apiQueue.clean(10000);

apiQueue.on('cleaned', function (job, type) {
  console.log('Cleaned %s %s jobs', job.length, type);
});

Steam.ready(function(err) {
    if (err) throw err;
    
    Promise.promisifyAll(Steam.prototype);
    
    var steam = new Steam()
    apiQueue.process(function(job, done) {
        console.log("processing");
        steam[job.data.call + "Async"](job.data.args)
        .then(function(data) {
            db.models.User.findById(job.data.userID)
            .then(function(user) {
                if (user) {
                    Promise.map(data.games, function(elem) {

                        var timePlayed = elem.playtime_forever;

                        db.models.Game.create(elem)
                        .then(function(game) {
                            return user.addGame(game, {timePlayed: timePlayed});
                        })
                    })
                    .then(function(game) {
                        done();
                    })
                    
                } else {
                    done("Couldn't find user");
                }
                
            })
        })
    })
})

