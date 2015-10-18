var express = require('express'),
    graphQLHTTP = require('express-graphql'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    redis = require('redis'),
    config = require('./config'),
    rClient = redis.createClient({port: config.REDIS_PORT, host: config.REDIS_HOST}),
    hitlistSchema = require("./models/hitlistSchema"),
    login = require('./routes/login');
    
var app = express();

app.use(session({
    store: new RedisStore({
        client: rClient
    }),
    secret: config.SESSION_SECRET
}))
app.use(login.passport.initialize());
app.use(login.passport.session());
app.use("/", login.routes);
app.use("/graphql", graphQLHTTP({
    schema: hitlistSchema,
    graphiql: true
}))

app.get("/", function(req, res) {
    if (req.user) {
        res.send(JSON.stringify(req.user))
    } else {
        res.send("<a href='/login'>login</a>");
    }
})

app.get("/debug", function(req, res) {
    var string = "<table>"
    if (req.user) {
        req.user.getGames()
        .then(function(games) {
            games.forEach(function(g) {
                string +=
                `<tr>
                <td>${g.name}</td>
                <td><img src="http://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg"</img></td>
                <td><img src="http://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_logo_url}.jpg"</img></td>
                <td>${g.UserGame.timePlayed}</td>
                </tr>`; 
            })
            
            string += "</table>";
            //string = JSON.stringify(games);
            res.send(string);
        })
    } else {
        res.send("Not logged in.");
    }
})

app.listen(3001, function() {
     console.log("[WEB] listening on 3000");
});