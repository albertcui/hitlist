var express = require('express'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    redis = require("redis"),
    rClient = redis.createClient(),
    login = require('./routes/login'),
    u = require('./utility'),
    config = require('./config');
    
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

app.listen(3001, function() {
     console.log("[WEB] listening on 3000");
});