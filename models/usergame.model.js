module.exports = function(sequelize, type) {
    var UserGame = sequelize.define("UserGame", {
        timePlayed: type.INTEGER
    })
    
    return UserGame;
}