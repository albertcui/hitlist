try {
    require('dotenv').load();
} catch(e) {
    console.log("[WARNING] error occurred when loading .env: %s", e);
}

var defaults = {
    "DATABASE_URL": "",
    "STEAM_API_KEY": "", //for API reqs, in worker
    "ROOT_URL": "http://localhost:3001",
    "SESSION_SECRET": "keyboard cat",
    "REDIS_HOST": "127.0.0.1",
    "REDIS_PORT": "6379"
};

for (var key in defaults) {
    process.env[key] = process.env[key] || defaults[key];
}

//now processes can use either process.env or config
module.exports = process.env;