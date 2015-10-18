var GraphQL = require("graphql");
var type = GraphQL.type;
var GraphQLRelay = require("graphql-relay");
var connection = GraphQLRelay.connection;
var node = GraphQLRelay.node;
var db = require("../db");
//var resolver = require("graphql-sequelize").resolver;

var UserGameStatus = new type.GraphQLEnumType({
    name: "Status",
    description: "Status the game is marked as.",
    values: {
        PLAYING : {
            description: "The game is currently being played"
        },
        COMPLETED: {
            description: "The game has been completed"
        },
        WILL_NOT_PLAY: {
            description: "The game will not be played"
        }
    }
});

var UserGame = new type.GraphQLObjectType({
    fields: () => ({
        id: new type.GraphQLNonNull(type.GraphQLInt), //node.globalIdField('UserGame'),
        name: {
            type: type.GraphQLString,
            description: "Name of the game"
        },
        appid: {
            type: new type.GraphQLNonNull(type.GraphQLInt),
            description: "The game's ID according to Valve's listing"
        },
        img_logo_url: {
            type: type.GraphQLString,
            description: "URL hash for the game's logo"
        },
        img_icon_url: {
            type: type.GraphQLString,
            description: "URL hash for the game's icon"
        },
        timePlayed: {
            type: type.GraphQLInt,
            description: "The amount of time the user has played this game"
        },
        status: UserGameStatus
    })
});

//var {connectionType: userGamesConnection} = connectionDefitions({name: "UserGames", nodeType: UserGame});

var User = new type.GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: new type.GraphQLNonNull(type.GraphQLInt), //node.globalIdField("User"),
        name: {
            type: type.GraphQLString,
            description: "User's display name"
        },
        games: {
            type: UserGame, //userGamesConnection,
            description: "The User's games",
            resolve: resolver(db.models.User.Games)
            //args: connection.connectionArgs
        }
    })
});

module.exports = new GraphQL.GraphQLSchema({
    query: new type.GraphQLObjectType({
        name: "RootQueryType",
        fields: {
            user: {
                type: User,
                args: {
                    id: {
                        type:  new type.GraphQLNonNull(type.GraphQLInt) //node.globalIdField("User")
                    }
                },
                resolve: resolver(db.models.User)
            }
        }
    })
})