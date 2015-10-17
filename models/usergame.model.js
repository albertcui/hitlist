module.exports = function(sequelize, type) {
    var UserGame = sequelize.define("UserGame", {
        timePlayed: { type: type.INTEGER, field: "playtime_forever" },
        status: type.ENUM("PLAYING", "COMPLETED", "WILL_NOT_PLAY")
    })
    
    return UserGame;
}