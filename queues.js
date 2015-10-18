/* 
    - To get List of Games with playtime
      https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=xxx
      &format=json&steamid=76561198062610336&include_appinfo=0&include_played_free_games=0
      
      - To get list of Achievements and Stats for a game
      http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=xxx
      &appid=218620
*/

var Queue = require("bull");
var config = require("./config");

module.exports = {
      getUserGamesQueue: Queue("getUserGamesAPI", config.REDIS_PORT, config.REDIS_HOST)
}