var Steam = require("steam-webapi");

Steam.key = require("../config").STEAM_API_KEY;

var steam;

module.exports = function(f, args, cb) {
    if (typeof steam === 'undefined') {
        Steam.ready(function(err) {
            if (err) throw err;
            steam = new Steam();
            steam[f](args, cb);
        }); 
    } else {
        steam[f](args, cb);
    }
};