var Sequelize = require('sequelize'),
    config = require('./config');

var sequelize = new Sequelize(config.DATABASE_URL);

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
var User = sequelize.define("User", {
    steamID: Sequelize.BIGINT,
    profileName: Sequelize.STRING,
    profileURL: Sequelize.STRING,
    avatar: Sequelize.STRING,
    avatarMedium: Sequelize.STRING,
    avatarFull: Sequelize.STRING,
    steamUserSince: Sequelize.DATE,
    HLJoinDate: Sequelize.DATE,
    HLLastLoggedIn: Sequelize.DATE,
    HLLastVisited: Sequelize.DATE,
    HLLastAPIUpdated: Sequelize.DATE
}, {
    indexes: [
        {
            unique: true,
            fields: ['steamID']
        }
    ]
});

var Game = sequelize.define("Game", {
    name: Sequelize.STRING,
    appID: Sequelize.INTEGER,
    imgIconURL: Sequelize.STRING,
    imgLogoURL: Sequelize.STRING,
    hasCommunityAvailableStats: Sequelize.BOOLEAN
})

var UserGame = sequelize.define("UserGame", {
    timePlayed: Sequelize.INTEGER
})

// TO DO: achivements, stats

sequelize.sync();

module.exports = {
    Game: Game,
    UserGame
}