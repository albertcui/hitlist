module.exports = function(sequelize, type) {
    var Game =  sequelize.define("Game", {
        name: type.STRING,
        appid: type.INTEGER,
        img_icon_url: type.STRING,
        img_logo_url: type.STRING,
        has_community_visible_stats:type.BOOLEAN
    }, {
        classMethods: {
            associate : function(models) {
                Game.belongsToMany(models.User, {through: models.UserGame});
            }  
        },
        indexes: [
            {
                unique: true,
                fields: ['appid']
            }
        ]
    });
    
    return Game;
}