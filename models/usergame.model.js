module.exports = function(sequelize, type) {
    var UserGame = sequelize.define("UserGame", {
        timePlayed: { type: type.INTEGER, field: "playtime_forever" }
    })
    
    return UserGame;
}