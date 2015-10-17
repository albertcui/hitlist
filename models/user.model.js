/*
Information returned by Passport

{ provider: 'steam',
  _json: 
   { steamid: '76561198062610336',
     communityvisibilitystate: 3,
     profilestate: 1,
     personaname: '[YASP.co]TripleA',
     lastlogoff: 1445035374,
     profileurl: 'http://steamcommunity.com/id/TriplexA/',
     avatar: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3f/3f5c2f5b5c9bb9a09bb71e926047f6a01352baf2.jpg',
     avatarmedium: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3f/3f5c2f5b5c9bb9a09bb71e926047f6a01352baf2_medium.jpg',
     avatarfull: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3f/3f5c2f5b5c9bb9a09bb71e926047f6a01352baf2_full.jpg',
     personastate: 1,
     realname: 'Albert',
     primaryclanid: '103582791435187791',
     timecreated: 1335502652,
     personastateflags: 0,
     loccountrycode: 'US',
     locstatecode: 'TX' },
  id: '76561198062610336',
  displayName: '[YASP.co]TripleA',
  photos: 
   [ { value: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3f/3f5c2f5b5c9bb9a09bb71e926047f6a01352baf2.jpg' },
     { value: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3f/3f5c2f5b5c9bb9a09bb71e926047f6a01352baf2_medium.jpg' },
     { value: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/3f/3f5c2f5b5c9bb9a09bb71e926047f6a01352baf2_full.jpg' } ] }
*/
module.exports = function(sequelize, type) {
    var User = sequelize.define("User", {
        steamid: type.BIGINT,
        personaname: type.STRING,
        profileurl: type.STRING,
        avatar: type.STRING,
        avatarmedium: type.STRING,
        avatarfull: type.STRING,
        timecreated: type.DATE, // The Steam account creation date
        HLJoinDate: type.DATE,
        HLLastLoggedIn: type.DATE,
        HLLastVisited: type.DATE,
        HLLastAPIUpdated: type.DATE
    }, {
        classMethods: {
            associate : function(models) {
                User.belongsToMany(models.Game, {through: models.UserGame});
            }  
        },
        indexes: [
            {
                unique: true,
                fields: ['steamid']
            }
        ]
    });
    
    return User;
}