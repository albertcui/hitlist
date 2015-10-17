module.exports = function(sequelize, type) {
    var Game =  sequelize.define("Game", {
        name: type.STRING,
        appID: type.INTEGER,
        imgIconURL: type.STRING,
        imgLogoURL: type.STRING,
        hasCommunityAvailableStats: type.BOOLEAN
    }, {
        classMethods: {
            associate : function(models) {
                Game.belongsToMany(models.User, {through: models.UserGame});
            }  
        },
        indexes: [
            {
                unique: true,
                fields: ['appID']
            }
        ]
    });
    
    return Game;
}